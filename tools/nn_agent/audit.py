#!/usr/bin/env python3
"""Auditor no destructivo de rutas y convenciones web. Solo biblioteca estándar."""
from pathlib import Path
from html.parser import HTMLParser
import json, sys
ROOT=Path(__file__).resolve().parents[2]
CATEGORIES=["inclusion-accesibilidad","bienestar-personal","desarrollo-espiritual","educacion-aprendizaje"]
APPS={"inclusion-accesibilidad":["brailux","rutinago","comunicago"],"bienestar-personal":["motiva"],"desarrollo-espiritual":["quizbible","mimomento"],"educacion-aprendizaje":["englishfast","crucilux","sudolux"]}
class Scan(HTMLParser):
 def __init__(self):
  super().__init__();self.tags=[];self.links=[];self.lang=False;self.ids=set();self.h1=0;self.titles=0
 def handle_starttag(self,tag,attrs):
  d=dict(attrs);self.tags.append(tag)
  if tag=="html":self.lang=bool(d.get("lang"))
  if tag=="h1":self.h1+=1
  if tag=="title":self.titles+=1
  if d.get("id"):self.ids.add(d["id"])
  if tag in ("a","link","script","img"):self.links.append((tag,d.get("href",d.get("src",""))))
def check(path,report):
 p=ROOT/path
 if not p.is_file():
  report.append({"path":str(path),"severity":"error","finding":"Archivo HTML ausente"});return
 scan=Scan();scan.feed(p.read_text(encoding="utf-8"))
 for name,present in [("lang",scan.lang),("title",scan.titles==1),("main","main" in scan.tags),("h1",scan.h1==1)]:
  if not present:report.append({"path":str(path),"severity":"review","finding":"Revisar convención "+name})
 for tag,url in scan.links:
  if url.startswith("https://github.com/neuronova-apps/"):
   report.append({"path":str(path),"severity":"review","finding":"Enlace visible o referencia al repositorio: "+url})
  if url.startswith(("http:","https:","mailto:","tel:","data:","#","javascript:","//")) or not url:continue
  clean=url.split("?")[0].split("#")[0]
  dest=(ROOT/clean.lstrip("/")) if clean.startswith("/") else (p.parent/clean)
  if clean.endswith("/"):dest=dest/"index.html"
  if not dest.exists():report.append({"path":str(path),"severity":"error","finding":"Recurso local no encontrado: "+url})
def main():
 issues=[]
 check(Path("index.html"),issues)
 for cat,apps in APPS.items():
  check(Path(cat)/"index.html",issues)
  for app in apps:
   check(Path(cat)/app/"index.html",issues)
   check(Path("privacy")/app/"index.html",issues)
 summary={"categories":len(CATEGORIES),"apps":sum(len(v) for v in APPS.values()),"checked_html":1+len(CATEGORIES)+2*sum(len(v) for v in APPS.values()),"errors":sum(x["severity"]=="error" for x in issues),"reviews":sum(x["severity"]=="review" for x in issues)}
 output={"summary":summary,"findings":issues}
 print(json.dumps(output,ensure_ascii=False,indent=2))
 sys.exit(1 if summary["errors"] else 0)
if __name__=="__main__":main()
