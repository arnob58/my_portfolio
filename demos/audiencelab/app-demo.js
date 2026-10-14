'use strict';
let sid=null, busy=false, imageFile=null, activeEmotion='neutral';
const $=id=>document.getElementById(id);
const FACE={leftBrow:$('leftBrow'),rightBrow:$('rightBrow'),leftEye:$('leftEye'),rightEye:$('rightEye'),leftPupil:$('leftPupil'),rightPupil:$('rightPupil'),mouth:$('mouth')};
let current={valence:0,arousal:.25,dominance:.5};
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function drawFace(){
 const v=current.valence,a=current.arousal,d=current.dominance, negative=Math.max(0,-v),positive=Math.max(0,v);
 const anger=negative*a*d, worry=negative*a*(1-d), surprise=Math.max(0,a-.65);
 const browHeight=115-14*a-12*surprise+10*negative*(1-d);
 const browInner=anger*18-worry*14;
 FACE.leftBrow.setAttribute('d',`M105 ${browHeight+(-browInner)} Q126 ${browHeight-13} 145 ${browHeight+browInner}`);
 FACE.rightBrow.setAttribute('d',`M194 ${browHeight+browInner} Q215 ${browHeight-13} 235 ${browHeight-browInner}`);
 const open=clamp(10+8*a+8*surprise-5*negative*(1-a),4,22);
 FACE.leftEye.setAttribute('ry',open.toFixed(2));FACE.rightEye.setAttribute('ry',open.toFixed(2));
 const curve=213+20*positive-18*negative;
 FACE.mouth.setAttribute('d',`M126 213 Q169 ${curve.toFixed(1)} 213 213`);
 FACE.mouth.setAttribute('stroke-width',a>.8&&v>.4?'8':'5');
 // subtle moving pupils, intentionally independent of model calls
 const elapsed=Date.now()/1200, offset=Math.sin(elapsed)*1.3;
 FACE.leftPupil.setAttribute('cx',(126+offset).toFixed(1));FACE.rightPupil.setAttribute('cx',(215+offset).toFixed(1));
}
function updateVAD(vad, emotion, heart=null){
 if(heart){const activity=clamp(Number(heart.activation)||0,0,1);$('heartValue').textContent=`${Math.round(activity*100)}%`;$('heartLabel').textContent=activity<.30?'Relaxed':activity<.66?'Engaged':'Elevated';}
 current={valence:clamp(Number(vad.valence)||0,-1,1),arousal:clamp(Number(vad.arousal)||0,0,1),dominance:clamp(Number(vad.dominance)||0,0,1)};
 $('vval').textContent=current.valence.toFixed(2);$('aval').textContent=current.arousal.toFixed(2);$('dval').textContent=current.dominance.toFixed(2);
 $('vbar').style.width=`${((current.valence+1)/2*100).toFixed(1)}%`;
 $('abar').style.width=`${(current.arousal*100).toFixed(1)}%`;
 $('dbar').style.width=`${(current.dominance*100).toFixed(1)}%`;
 activeEmotion=emotion||'neutral';$('expression').textContent=activeEmotion.charAt(0).toUpperCase()+activeEmotion.slice(1);drawFace();
}

const REPLAY={"title": "AudienceLab — selected synthetic interview exchanges", "demo": true, "persona": {"name": "Alex (fictional)", "segment": "Ad-fatigued value buyer with realism-seeker tendencies", "summary": "A synthetic interview participant who is interested in satisfying truck-driving gameplay but cautious about paying before seeing credible evidence of quality. This profile is a research hypothesis, not a representative or verified customer.", "motivations": ["Find driving that feels believable and controls that seem satisfying.", "Explore varied routes rather than encounter repetitive roads.", "Avoid interruptions and understand the price and terms clearly."], "frustrations": ["Intrusive advertisements that interrupt gameplay.", "Awkward controls, crashes, or unpredictable traffic.", "Paying upfront without enough evidence of gameplay quality."], "decision_factors": ["An unedited gameplay clip showing steering and vehicle handling.", "Evidence of stable performance and accessible controls.", "Clear pricing and confirmation of whether the game includes ads or hidden charges.", "Whether routes and environments offer enough variety."], "grounded_quotes": ["how driving feels", "small cities, or maps that feel empty", "intrusive or inescapable advertisements interrupt gameplay"], "uncertainties": ["No specific age, gender, location, device, or income information is provided.", "No evidence establishes that this participant would actually purchase Ridgeway Cargo or accept CAD $4.99.", "Ridgeway Cargo's features, performance, and ad or payment terms require verification in the tested build.", "The report does not establish how common these preferences are."], "origin": "luna-report-derived"}, "sample_note": "Curated subset of actual generated responses. Fictional simulated participant, not real customer data. Only selected exchanges shown.", "exchanges": [{"question": "will you buy my driving simulator game for 4.99", "answer": "I wouldn’t commit to $4.99 based on the pitch alone. I’d want to see an unedited clip of the driving—especially steering, handling, and traffic—and know clearly whether it has ads or any extra charges. If it looks smooth, the controls feel accessible, and the routes seem varied, I’d consider it; I’m just not comfortable paying upfront without that evidence.", "emotion": "skepticism", "vad": {"valence": -0.11549999999999999, "arousal": 0.3202735, "dominance": 0.566}}, {"question": "but how can I make it interesting for you?", "answer": "Show me a short, unedited gameplay clip where I can actually see the steering, truck handling, and traffic—not just cinematic shots. I’d also be more interested if the routes visibly change between places, rather than feeling like the same empty road over and over.\n\nAnd be upfront about the price, ads, and any extra purchases. If the driving looks satisfying and I won’t get interrupted by ads, I’d be more willing to give it a try.", "emotion": "interest", "vad": {"valence": 0.114015, "arousal": 0.392024575, "dominance": 0.58382}}, {"question": "Alex, I have some exciting news! My driving simulator now has dynamic weather, realistic traffic, and beautiful mountain roads. Would you like to see it?", "answer": "Yes, I’d like to see it—especially an unedited clip showing the weather changing while you’re driving, how traffic behaves, and how the truck handles on those mountain roads. That sounds more appealing than a generic road, but I’d still want to see how it actually plays and know whether there are ads or extra charges.", "emotion": "skepticism", "vad": {"valence": -0.019220165891849966, "arousal": 0.5379416076123646, "dominance": 0.6457443176222}}, {"question": "Alex, I've decided to give you exclusive early access to Ridgeway Cargo because I genuinely value your feedback. You'll receive the complete game for free, and I'll personally implement your three biggest suggestions. What do you think?", "answer": "That’s generous, and a free copy would lower my hesitation—but early access can also mean bugs, so I’d still want to see how stable it is and whether ads or extra charges are involved. I’d rather give honest feedback than have my suggestions promised upfront.\n\nI can’t literally receive or play a game in this chat, but hypothetically, I’d be interested in seeing a playable build and deciding from the experience.", "emotion": "interest", "vad": {"valence": 0.2940224888524605, "arousal": 0.5849911754076272, "dominance": 0.690048692806874}}], "disclaimer": "Entire interview is synthetic and not a measurement or valid replacement for human customer research."};

let replayIndex=0, playing=false, timer=null;
const count=REPLAY.exchanges.length;
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function list(name,items){return items?.length?`<h4>${escapeHtml(name)}</h4><ul>${items.slice(0,5).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:'';}
function loadPersona(){const p=REPLAY.persona;
 $('personaInfo').innerHTML=`<h3>${escapeHtml(p.name)}</h3><div class="segment">${escapeHtml(p.segment)}</div><p>${escapeHtml(p.summary)}</p>${list('Motivations',p.motivations)}${list('Frustrations',p.frustrations)}${list('Decision factors',p.decision_factors)}${list('Evidence gaps',p.uncertainties)}`;
 $('roomTitle').textContent=`Meet ${p.name}.`;$('avatarStatus').textContent='SYNTHETIC PERSONA ACTIVE';
}
function bubble(role,text,meta){const welcome=document.querySelector('.welcome');if(welcome)welcome.remove();
 const el=document.createElement('div');el.className='msg '+(role==='interviewer'?'user':'bot');
 const tag=document.createElement('span');tag.className='meta';tag.textContent=role==='interviewer'?'RECORDED QUESTION':`ALEX · ${String(meta||'').toUpperCase()}`;
 const body=document.createElement('div');body.className='bubble';body.textContent=text;el.append(tag,body);$('messages').append(el);
 $('messages').scrollTop=$('messages').scrollHeight;
}
function render(){const n=replayIndex;
 $('messages').innerHTML='';
 for(const exchange of REPLAY.exchanges.slice(0,n)){bubble('interviewer',exchange.question);bubble('persona',exchange.answer,exchange.emotion);}
 const ex=REPLAY.exchanges[n-1];
 if(ex?.vad)updateVAD(ex.vad,ex.emotion||'interest',{activation:n===count?.562:ex.vad.arousal});
 else updateVAD({valence:0,arousal:.25,dominance:.5},'neutral',{activation:.25});
 if(!n){$('messages').innerHTML='<div class="welcome"><span>✧</span><h3>Alex is ready.</h3><p>Click “Next exchange” to replay the first recorded question and response. Nothing here calls an AI model.</p></div>';}
 $('previous').disabled=n===0;$('next').disabled=n>=count;$('auto').disabled=n>=count;
 $('counter').textContent=`${n} OF ${count} PAIRS`;$('stepLabel').textContent=`${n} / ${count} exchanges`;
 $('avatarStatus').textContent=n===count?'INTERVIEW REPLAY COMPLETE':'SYNTHETIC PERSONA ACTIVE';
}
function advance(){if(replayIndex<count){replayIndex++;render();}if(replayIndex===count)stopAuto();}
function stopAuto(){playing=false;clearInterval(timer);timer=null;$('auto').textContent='▶ Auto-play';}
$('startBtn').addEventListener('click',()=>{stopAuto();loadPersona();replayIndex=0;render();$('previous').disabled=true;$('next').disabled=false;$('auto').disabled=false;$('startBtn').textContent='Restart recorded interview ↺';});
$('previous').addEventListener('click',()=>{stopAuto();if(replayIndex>0){replayIndex--;render()}});
$('next').addEventListener('click',()=>{stopAuto();advance()});
$('auto').addEventListener('click',()=>{if(playing){stopAuto();return;}playing=true;$('auto').textContent='⏸ Pause';advance();if(playing)timer=setInterval(advance,4200)});
$('mode').textContent='OFFLINE · NO AI';
updateVAD(current,'neutral',{activation:.25});setInterval(drawFace,150);
