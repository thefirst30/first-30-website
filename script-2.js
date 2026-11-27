
const researchSources = {
  "1": {
    "kicker": "REGULATION · RESEARCH",
    "title": "The physiology of breathing.",
    "credit": "Laborde et al. (2022) · Systematic review and meta-analysis",
    "summary": "Research on voluntary slow breathing examines changes in heart rate and heart rate variability during and after practice.",
    "context": "We use comfortable paced breathing to prepare for effort and transition into recovery. We do not measure HRV or claim that our specific breathing rhythm produces a guaranteed effect.",
    "links": [
      [
        "Laborde et al. — slow breathing and HRV",
        "https://pubmed.ncbi.nlm.nih.gov/35623448/"
      ],
      [
        "Extended exhale trial (2023)",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC10395759/"
      ]
    ]
  },
  "2": {
    "kicker": "COGNITION · RESEARCH",
    "title": "The practice of executive function.",
    "credit": "Selected cognitive training and task-paradigm research",
    "summary": "Our four rounds draw on research into auditory selective attention, working memory, task switching and dual-task coordination.",
    "context": "Evidence about cognitive processes and performance on trained tasks does not establish that this programme improves everyday functioning. Our exercises are not clinical assessments.",
    "links": [
      [
        "FILTER — Kattner & Ellermeier (2020)",
        "https://pubmed.ncbi.nlm.nih.gov/31436452/"
      ],
      [
        "HOLD — Karbach & Verhaeghen (2014)",
        "https://pubmed.ncbi.nlm.nih.gov/25298292/"
      ],
      [
        "PIVOT — Monsell (2003)",
        "https://pubmed.ncbi.nlm.nih.gov/12639695/"
      ],
      [
        "STACK — Bherer et al. (2005)",
        "https://pubmed.ncbi.nlm.nih.gov/16420143/"
      ],
      [
        "Midlife cognitive training — Zhu et al.",
        "https://doi.org/10.1007/s11065-024-09649-z"
      ],
      [
        "Limits of transfer — Simons et al. (2016)",
        "https://doi.org/10.1177/1529100616661983"
      ]
    ]
  },
  "3": {
    "kicker": "RECOVERY · RESEARCH",
    "title": "The science of stepping out of effort.",
    "credit": "Laborde et al. (2022); Warm et al. (2008); Risko & Gilbert (2016)",
    "summary": "Research into slow breathing, sustained mental workload and cognitive offloading informs our use of deliberate recovery and a private written priority cue.",
    "context": "Sound and lighting are part of our designed experience. We do not measure recovery physiologically or claim that our combined recovery sequence has been validated.",
    "links": [
      [
        "Slow breathing and HRV",
        "https://pubmed.ncbi.nlm.nih.gov/35623448/"
      ],
      [
        "Vigilance and mental workload",
        "https://pubmed.ncbi.nlm.nih.gov/18689050/"
      ],
      [
        "Cognitive offloading",
        "https://doi.org/10.1016/j.tics.2016.07.002"
      ]
    ]
  }
};
const researchDialog=document.getElementById('research-dialog');
let researchTrigger=null;
researchDialog.addEventListener('close',()=>{if(researchTrigger?.isConnected)researchTrigger.focus();researchTrigger=null;});
document.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>{
 researchTrigger=b;
 const d=researchSources[b.dataset.source];
 for(const [field,id] of [['kicker','research-kicker'],['title','research-title'],['credit','research-credit'],['summary','research-summary'],['context','research-context']]) document.getElementById(id).textContent=d[field];
 const links=document.getElementById('research-links');
 links.replaceChildren();
 for(const [label,url] of d.links){const li=document.createElement('li');const a=document.createElement('a');a.href=url;a.textContent=label;a.target='_blank';a.rel='noopener noreferrer';li.append(a);links.append(li);}
 researchDialog.showModal();
}));
document.querySelector('.research-close').addEventListener('click',()=>researchDialog.close());
researchDialog.addEventListener('click',e=>{if(e.target===researchDialog)researchDialog.close()});
