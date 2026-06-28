document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAP();
    initParticles();
    initCounters();
});

/* =========================================
   1. THREE.JS 3D BACKGROUND SCENE
========================================= */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    container.appendChild(renderer.domElement);

    // Group to hold all interactive objects
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Lighting (Matching brand colors: Primary #3D348B, Secondary #E5008A)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3D348B, 1.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xE5008A, 1.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create Abstract Educational Shapes

    // 1. Globe (Sphere with rings)
    const globeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3D348B, 
        roughness: 0.2, 
        metalness: 0.8,
        wireframe: true
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), globeMaterial);
    globe.position.set(6, 2, -5);
    
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.05, 16, 100), new THREE.MeshStandardMaterial({color: 0xE5008A}));
    ring1.rotation.x = Math.PI / 2;
    globe.add(ring1);
    
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.05, 16, 100), new THREE.MeshStandardMaterial({color: 0x0099FF}));
    ring2.rotation.y = Math.PI / 2;
    globe.add(ring2);
    
    objectsGroup.add(globe);

    // 2. Floating Books (Flattened boxes)
    const bookMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0xE5008A, roughness: 0.4 });
    const materials = [coverMaterial, coverMaterial, coverMaterial, coverMaterial, bookMaterial, bookMaterial];
    
    for (let i = 0; i < 5; i++) {
        const book = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.5), materials);
        book.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10 - 5
        );
        book.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        
        // Custom animation variables
        book.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatOffset: Math.random() * Math.PI * 2
        };
        objectsGroup.add(book);
    }

    // 3. Floating Graduation Cap (Abstract Cone + Plane)
    const capGroup = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.5, 4), new THREE.MeshStandardMaterial({color: 0x2d2d2d, flatShading: true}));
    cone.rotation.y = Math.PI / 4;
    cone.position.y = -0.5;
    const board = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 3), new THREE.MeshStandardMaterial({color: 0x2d2d2d}));
    capGroup.add(cone);
    capGroup.add(board);
    capGroup.position.set(-6, 4, -2);
    capGroup.rotation.z = -0.2;
    objectsGroup.add(capGroup);

    // Mouse Interaction (Parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Ease camera towards mouse position (Parallax)
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        objectsGroup.rotation.y += 0.002;
        objectsGroup.rotation.x += 0.001;

        // Animate individual objects
        globe.rotation.y += 0.01;
        globe.rotation.x += 0.005;
        
        capGroup.position.y = 4 + Math.sin(time * 2) * 0.5;

        objectsGroup.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'BoxGeometry') {
                child.rotation.x += child.userData.rotSpeedX;
                child.rotation.y += child.userData.rotSpeedY;
                child.position.y += Math.sin(time * child.userData.floatSpeed + child.userData.floatOffset) * 0.02;
            }
        });

        // Interactive camera tilt based on mouse
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* =========================================
   2. GSAP SCROLL ANIMATIONS
========================================= */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Apply reveal classes to main elements if not hardcoded in HTML
    document.querySelectorAll('.section-title, .feature-card, .event-card, .principal-img').forEach(el => {
        if (!el.classList.contains('gsap-reveal')) el.classList.add('gsap-reveal');
    });

    // Animate all elements with .gsap-reveal class
    const revealElements = document.querySelectorAll('.gsap-reveal');
    
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { 
                y: 50, 
                opacity: 0,
                visibility: 'hidden'
            },
            {
                y: 0,
                opacity: 1,
                visibility: 'visible',
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Trigger when element is 85% down the viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/* =========================================
   3. tsParticles BACKGROUND
========================================= */
function initParticles() {
    if (typeof tsParticles === 'undefined') return;

    // We only initialize particles if the #tsparticles container exists
    const particlesContainer = document.getElementById('tsparticles');
    if (!particlesContainer) return;

    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            color: { value: ["#3D348B", "#E5008A", "#0099FF"] },
            links: {
                color: "#2d2d2d",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out"
            },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } }
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                grab: { distance: 140, links: { opacity: 0.5 } }
            }
        },
        detectRetina: true
    });
}

/* =========================================
   4. ANIMATED COUNTERS
========================================= */
function initCounters() {
    const counterElement = document.getElementById('aboutYearsNumText');
    if (!counterElement) return;

    let hasCounted = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            
            // Extract number from string like "20+"
            const targetText = counterElement.innerText;
            const targetNum = parseInt(targetText.replace(/[^0-9]/g, '')) || 20;
            const suffix = targetText.replace(/[0-9]/g, '');

            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = targetNum / (duration / 16); // 60fps

            const updateCounter = () => {
                current += increment;
                if (current < targetNum) {
                    counterElement.innerText = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counterElement.innerText = targetNum + suffix;
                }
            };
            
            updateCounter();
        }
    });

    observer.observe(counterElement);
}
