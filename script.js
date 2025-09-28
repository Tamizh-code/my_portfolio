  // --- 1) Simple SPA routing ---
    const routes = {
      '/': document.getElementById('page-home'),
      '/projects': document.getElementById('page-projects'),
      '/about': document.getElementById('page-about'),
      '/blog': document.getElementById('page-blog'),
      '/contact': document.getElementById('page-contact')
    }

    function showRoute(path){
      Object.values(routes).forEach(el=>el.style.display='none');
      const page = routes[path] || routes['/'];
      page.style.display='block';
      // nav active
      document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('active', a.dataset.route===path));
      // fade in animation
      setTimeout(()=>page.classList.add('visible'),50);
      document.getElementById('app').scrollTo({top:0,behavior:'smooth'});
    }

    function handleHash(){
      const hash = location.hash.replace('#','') || '/';
      showRoute(hash);
    }
    window.addEventListener('hashchange',handleHash);
    handleHash(); // initial

    // --- 2) Typewriter effect ---
    const words = ['UI/UX Designer','Frontend Engineer','Product Builder'];
    let i=0, pos=0, dir=1;
    const tw = document.getElementById('typewriter');
    function tick(){
      tw.textContent = words[i].slice(0,pos);
      pos += dir;
      if(pos>words[i].length){dir=-1;setTimeout(tick,1200);return}
      if(pos<0){dir=1;i=(i+1)%words.length}
      setTimeout(tick,80);
    }
    tick();

    // --- 3) Projects modal ---
    const projectData = {
      p1:{title:'Design System UI Kit',body:'A production-ready component library with accessibility and tokens.',tags:['React','Storybook','Design']},
      p2:{title:'Social Feed App',body:'Realtime social feed with offline-first sync and optimistic UI.',tags:['PWA','Socket.IO','IndexedDB']},
      p3:{title:'Studio Website',body:'A high-performance marketing site with SVG and timeline animations.',tags:['GSAP','SVG','Performance']},
      p4:{title:'E-commerce prototype',body:'Checkout flows and analytics for conversion optimization.',tags:['Stripe','Analytics']},
      p5:{title:'Design-to-code Flow',body:'Automation bridging Figma tokens to CSS variables.',tags:['DesignOps']},
      p6:{title:'Open Source Tooling',body:'CLI tools to speed up developer workflows and scaffolding.',tags:['CLI','Node']}
    }

    document.querySelectorAll('.project').forEach(p=>p.addEventListener('click',()=>{
      const id = p.dataset.id;
      const d = projectData[id];
      if(!d) return;
      document.getElementById('modalTitle').textContent = d.title;
      document.getElementById('modalBody').textContent = d.body;
      const tags = d.tags.map(t=>'<span class="tag" style="margin-right:6px">'+t+'</span>').join(' ');
      document.getElementById('modalTags').innerHTML = tags;
      document.getElementById('modal').classList.add('open');
    }))
    document.getElementById('closeModal').addEventListener('click',()=>document.getElementById('modal').classList.remove('open'));
    document.getElementById('modal').addEventListener('click',e=>{ if(e.target.id==='modal') document.getElementById('modal').classList.remove('open') });

    // --- 4) contact form (no backend) ---
    document.getElementById('contactForm').addEventListener('submit',e=>{
      e.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = 'Pretending to send...';
      setTimeout(()=>{status.textContent='Message sent — I will get back to you via email! (Demo)';},900);
    })

    // --- 5) Floating cursor & subtle interactions ---
    const cursor = document.getElementById('cursor');
    window.addEventListener('mousemove',e=>{
      cursor.style.left = e.clientX+'px'; cursor.style.top=e.clientY+'px';
    })
    document.querySelectorAll('a,button,input,textarea,.project').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.style.transform='translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave',()=>cursor.style.transform='translate(-50%,-50%) scale(1)');
    })

    // --- 6) reveal on scroll ---
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible'); })
    },{threshold:0.12});
    document.querySelectorAll('.fade-in, .project, .card').forEach(el=>observer.observe(el));

    // --- 7) helper bits ---
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('hireBtn').addEventListener('click', ()=> location.hash='#/contact');

    // small keyboard shortcut: press P to open Projects
    window.addEventListener('keydown', e=>{ if(e.key.toLowerCase()==='p') location.hash='#/projects' });

    // small progressive enhancement: store name from query param
    (function(){
      const params = new URLSearchParams(location.search);
      const name = params.get('name');
      if(name){document.getElementById('dynamic-name').textContent = name;document.querySelector('.logo').textContent = name.split(' ').map(s=>s[0]).slice(0,2).join('')}
    })();

    // accessibility: respect reduced motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.querySelectorAll('*').forEach(el=>el.style.transitionDuration='0s');
    }