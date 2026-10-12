"""Translate the recovered GML subset into explicit browser-runtime calls.
No evaluation of the executable or dynamic eval is needed in the browser.
"""
from pathlib import Path
import re,json,sys
ROOT=Path(__file__).resolve().parents[1]
TOKEN=re.compile(r'\s+|//[^\n]*|/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[A-Za-z_]\w*|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|/=|&&|\|\||[{}()\[\].,;:+*/%<>=!&|?-]')
class Parser:
 def __init__(self,text):
  self.ts=[];end=0
  for m in TOKEN.finditer(text):
   assert not text[end:m.start()].strip(),text[end:m.start()]
   end=m.end();s=m.group()
   if not s.isspace() and not s.startswith(('//','/*')):self.ts.append(s)
  assert not text[end:].strip();self.ts.append('EOF');self.i=0
 def peek(self):return self.ts[self.i]
 def pop(self):s=self.peek();self.i+=1;return s
 def eat(self,s):
  if self.peek()==s:self.i+=1;return True
  return False
 def expect(self,s):
  assert self.eat(s),(s,self.ts[max(0,self.i-8):self.i+12])
 def block(self):
  if self.eat('{'):
   a=[]
   while self.peek()!='}':a.append(self.stmt())
   self.expect('}');return ('block',a)
  return self.stmt()
 def program(self):
  a=[]
  while self.peek()!='EOF':a.append(self.stmt())
  return ('block',a)
 def stmt(self):
  t=self.peek()
  if t=='{':return self.block()
  if self.eat(';'):return ('empty',)
  if self.eat('if'):
   self.expect('(');c=self.expr();self.expect(')');a=self.block();b=self.block() if self.eat('else') else ('empty',)
   return ('if',c,a,b)
  if t in ['while','repeat','with']:
   self.pop();self.expect('(');c=self.expr();self.expect(')');return (t,c,self.block())
  if self.eat('for'):
   self.expect('(');a=self.declaration() if self.peek()=='var' else ('expr',self.expr());self.expect(';');b=self.expr();self.expect(';');c=self.expr();self.expect(')');return ('for',a,b,c,self.block())
  if self.eat('switch'):
   self.expect('(');v=self.expr();self.expect(')');self.expect('{');cases=[]
   while self.peek()!='}':
    if self.eat('case'):k=self.expr();self.expect(':');cases.append([k,[]])
    elif self.eat('default'):self.expect(':');cases.append([None,[]])
    else:cases[-1][1].append(self.stmt())
   self.expect('}');return ('switch',v,cases)
  if self.eat('enum'):
   name=self.pop();self.expect('{');values={};n=0
   while self.peek()!='}':
    k=self.pop()
    if self.eat('='):n=int(self.pop())
    values[k]=n;n+=1
    if not self.eat(','):break
   self.expect('}');return ('enum',name,values)
  if self.eat('function'):
   name=self.pop();self.expect('(');args=[]
   if self.peek()!=')':
    args.append(self.pop())
    while self.eat(','):args.append(self.pop())
   self.expect(')');return ('function',name,args,self.block())
  if self.eat('return'):
   e=None if self.peek()==';' else self.expr();self.expect(';');return ('return',e)
  if self.peek() in ['break','continue']:
   t=self.pop();self.expect(';');return (t,)
  if self.peek()=='var':
   s=self.declaration();self.expect(';');return s
  e=self.expr();self.expect(';');return ('expr',e)
 def declaration(self):
  self.expect('var');ds=[]
  while True:
   name=self.pop();value=self.expr(2) if self.eat('=') else ('lit','0');ds.append((name,value))
   if not self.eat(','):break
  return ('var',ds)
 prec={'=':1,'+=':1,'-=':1,'*=':1,'/=':1,'||':2,'&&':3,'|':4,'&':5,'==':6,'!=':6,'<':7,'>':7,'<=':7,'>=':7,'+':8,'-':8,'*':9,'/':9,'%':9,'div':9,'mod':9}
 def expr(self,minp=0):
  t=self.pop()
  if t in ['!','-','+']:a=('unary',t,self.expr(10))
  elif t=='(':
   a=self.expr();self.expect(')')
  elif t=='[':
   es=[]
   if self.peek()!=']':
    es.append(self.expr())
    while self.eat(','):es.append(self.expr())
   self.expect(']');a=('array',es)
  elif t.startswith('"') or re.match(r'^\d',t):a=('lit',t)
  elif re.match(r'^[A-Za-z_]\w*$',t) and t!='EOF':a=('name',t)
  else:raise ValueError(('expression',t,self.ts[self.i:self.i+10]))
  while True:
   t=self.peek()
   if t=='.':self.pop();a=('member',a,self.pop())
   elif t=='[':self.pop();k=self.expr();self.expect(']');a=('index',a,k)
   elif t=='(':
    self.pop();args=[]
    if self.peek()!=')':
     args.append(self.expr())
     while self.eat(','):args.append(self.expr())
    self.expect(')');a=('call',a,args)
   elif t in ['++','--']:self.pop();a=('post',t,a)
   elif t in self.prec and self.prec[t]>=minp:
    p=self.prec[t];self.pop();b=self.expr(p if p==1 else p+1);a=('bin',t,a,b)
   else:break
  return a
class Emit:
 def __init__(self):self.uid=0;self.calls=set()
 def boolean(self,a):
  if a[0]=='unary' and a[1]=='!' or a[0]=='bin' and a[1] in ['==','!=','<','>','<=','>=','&&','||'] or a[0]=='name' and a[1] in ['true','false']:return self.expr(a)
  return f'E.truthy({self.expr(a)})'
 def expr(self,a):
  t=a[0]
  if t=='lit':return a[1]
  if t=='name':return {'true':'true','false':'false'}.get(a[1],f'E.get({json.dumps(a[1])})')
  if t=='array':return '['+','.join(map(self.expr,a[1]))+']'
  if t=='unary':return '('+a[1]+(self.boolean(a[2]) if a[1]=='!' else self.expr(a[2]))+')'
  if t=='member':return f'E.member({self.expr(a[1])},{json.dumps(a[2])})'
  if t=='index':return f'E.index({self.expr(a[1])},{self.expr(a[2])})'
  if t=='call':
   assert a[1][0]=='name',a
   self.calls.add(a[1][1]);return f'E.call({json.dumps(a[1][1])},[{",".join(map(self.expr,a[2]))}])'
  if t=='post':return self.assign(a[2],'+=' if a[1]=='++' else '-=',('lit','1'))
  if t=='bin':
   op,l,r=a[1:]
   if op in ['=','+=','-=','*=','/=']:return self.assign(l,op,r)
   if op in ['&&','||']:return f'({self.boolean(l)} {op} {self.boolean(r)})'
   if op=='div':return f'Math.trunc({self.expr(l)}/{self.expr(r)})'
   return f'({self.expr(l)} {"%" if op=="mod" else op} {self.expr(r)})'
  raise ValueError(a)
 def ensure(self,a):
  if a[0]=='index':return f'E.ensureIndex({self.ensure(a[1])},{self.expr(a[2])})'
  if a[0]=='name':return f'E.ensureArray({json.dumps(a[1])})'
  return self.expr(a)
 def assign(self,l,op,r):
  value=self.expr(r)
  if op!='=':value=f'({self.expr(l)} {op[0]} {value})'
  if l[0]=='name':return f'E.set({json.dumps(l[1])},{value})'
  if l[0]=='member':return f'E.put({self.expr(l[1])},{json.dumps(l[2])},{value})'
  if l[0]=='index':return f'E.putIndex({self.ensure(l[1])},{self.expr(l[2])},{value})'
  raise ValueError(('lvalue',l))
 def stmt(self,a):
  t=a[0]
  if t=='empty':return ''
  if t=='block':return '{\n'+''.join(self.stmt(x) for x in a[1] if x[0]=='enum')+''.join(self.stmt(x) for x in a[1] if x[0]!='enum')+'}\n'
  if t=='expr':return self.expr(a[1])+';\n'
  if t=='var':return ''.join(f'E.declare({json.dumps(k)},{self.expr(v)});\n' for k,v in a[1])
  if t=='enum':return f'E.declare({json.dumps(a[1])},{json.dumps(a[2])});\n'
  if t=='if':return f'if({self.boolean(a[1])}){self.stmt(a[2])}else {self.stmt(a[3]) or "{}"}\n'
  if t=='while':return f'while({self.boolean(a[1])}){{E.tick();\n{self.stmt(a[2])}}}\n'
  if t=='for':return '{'+self.stmt(a[1])+'for(;'+self.boolean(a[2])+';'+self.expr(a[3])+'){E.tick();'+self.stmt(a[4])+'}}\n'
  if t=='repeat':
   self.uid+=1;v=f'__repeat{self.uid}'
   return f'for(let {v}=Math.max(0,Math.trunc({self.expr(a[1])}));{v}>0;{v}--){{E.tick();{self.stmt(a[2])}}}\n'
  if t=='with':
   self.uid+=1;v=f'__target{self.uid}'
   return f'for(const {v} of E.targets({self.expr(a[1])})){{const E2=E.withSelf({v});{{const E=E2;{self.stmt(a[2])}}}}}\n'
  if t=='switch':return f'switch({self.expr(a[1])}){{'+''.join(('default:' if k is None else 'case '+self.expr(k)+':')+''.join(self.stmt(s) for s in ss) for k,ss in a[2])+'}\n'
  if t in ['break','continue']:return t+';\n'
  if t=='return':return 'return '+(self.expr(a[1]) if a[1] else '')+';\n'
  raise ValueError(a)

def main():
 out=ROOT/'dist/code.js';functions={};scripts={};calls=set();fail=[]
 sources={p.name:p for p in (ROOT/'recovered/code').glob('*.gml')}
 sources.update({p.name:p for p in (ROOT/'patches').glob('*.gml')})
 for p in sorted(sources.values(),key=lambda p:p.name):
  try:
   ast=Parser(p.read_text()).program();emit=Emit()
   decls=[x for x in ast[1] if x[0]=='function']
   if decls:
    for _,name,args,body in decls:
     scripts[name]='function(E){\n'+''.join(f'E.declare({json.dumps(n)},E.args[{i}] ?? 0);\n' for i,n in enumerate(args))+emit.stmt(body)+'}'
   else:
    functions[p.stem]='function(E)'+emit.stmt(ast)
    if p.stem.startswith('gml_GlobalScript_'):scripts[p.stem[len('gml_GlobalScript_'):]]=functions[p.stem]
   calls|=emit.calls
  except Exception as e:fail.append((p.name,str(e)))
 if fail:print('FAILURES',fail);sys.exit(1)
 out.write_text('export const CODE={\n'+',\n'.join(json.dumps(k)+':'+v for k,v in functions.items())+'\n};\nexport const SCRIPTS={\n'+',\n'.join(json.dumps(k)+':'+v for k,v in scripts.items())+'\n};\n')
 (ROOT/'test/calls.json').write_text(json.dumps(sorted(calls),indent=2))
 print('Compiled',len(functions),'events and',len(scripts),'scripts;',out.stat().st_size,'bytes')
if __name__=='__main__':main()
