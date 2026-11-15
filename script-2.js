
const researchSources = {
  1: {
    kicker:'WEEKS 1–4 · RESEARCH SOURCE',
    title:'Extended exhalations & stress',
    credit:'Balban et al. (2023)\nCell Reports Medicine · Stanford University',
    summary:'A randomized controlled trial found that five minutes of daily exhale-focused breathwork (cyclic sighing) over one month improved mood and lowered resting breathing rate more effectively than mindfulness meditation.',
    context:'Mechanism: Extending the exhale stimulates the vagus nerve, slowing heart rate and shifting the autonomic nervous system toward recovery.'
  },
  2: {
    kicker:'WEEKS 5–8 · RESEARCH CONTEXT',
    title:'Visual focus & cognitive attention',
    credit:'Feldman & Friston (2010) · Frontiers in Human Neuroscience\nMathôt (2018) · Journal of Cognition',
    summary:'Visual attention regulates how the brain allocates cognitive precision and physiological alertness. Deliberately shifting between narrow focal attention and broad panoramic awareness helps balance active concentration with nervous system recovery.',
    context:'Research context: Drawn from established visual neuroscience and autonomic physiology principles rather than a direct clinical trial of this specific program.'
  },
  3: {
    kicker:'WEEKS 9–12 · RESEARCH SOURCES',
    title:'Acoustic entrainment & alpha waves',
    credit:'Garcia-Argibay et al. (2019) · Psychological Research\nMallik & Russo (2022) · PLOS ONE',
    summary:'A meta-analysis of 22 studies and a randomized controlled trial show that low-frequency auditory beats can reduce state anxiety and support calm cognitive states, particularly when paired with relaxing soundscapes.',
    context:'Research Context: While auditory beats are linked to measurable shifts in relaxation and mood, individual EEG entrainment and focus responses will vary per person.'
  }
};
const researchDialog=document.getElementById('research-dialog');
let researchTrigger=null;
researchDialog.addEventListener('close',()=>{if(researchTrigger?.isConnected)researchTrigger.focus();researchTrigger=null;});
document.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>{
 researchTrigger=b;
 const d=researchSources[b.dataset.source];
 for(const [field,id] of [['kicker','research-kicker'],['title','research-title'],['credit','research-credit'],['summary','research-summary'],['context','research-context']]) document.getElementById(id).textContent=d[field];
 researchDialog.showModal();
}));
document.querySelector('.research-close').addEventListener('click',()=>researchDialog.close());
researchDialog.addEventListener('click',e=>{if(e.target===researchDialog)researchDialog.close()});
