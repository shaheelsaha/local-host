// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';

const ParticleNetwork: React.FC = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        const particleCount = 70;
        const maxDistance = 150;
        const lineColor = '#00FFC2';

        let mouse = {
            x: -1000,
            y: -1000,
        };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = Math.random() * 1 - 0.5;
                this.vy = Math.random() * 1 - 0.5;
                this.radius = Math.random() * 1.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx!.fill();
            }
        }

        const init = () => {
            setCanvasSize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx!.beginPath();
                        ctx!.strokeStyle = `${lineColor}${Math.round((1 - distance / maxDistance) * 10).toString(16)}`;
                        ctx!.lineWidth = 0.5;
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }
                
                // Connect to mouse
                const dxMouse = particles[i].x - mouse.x;
                const dyMouse = particles[i].y - mouse.y;
                const distanceMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
                if (distanceMouse < maxDistance) {
                    ctx!.beginPath();
                    ctx!.strokeStyle = `${lineColor}${Math.round((1 - distanceMouse / maxDistance) * 10).toString(16)}`;
                    ctx!.lineWidth = 0.5;
                    ctx!.moveTo(particles[i].x, particles[i].y);
                    ctx!.lineTo(mouse.x, mouse.y);
                    ctx!.stroke();
                }
            }
        };

        const animate = () => {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();

            requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        
        const handleMouseOut = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        window.addEventListener('resize', init);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />;
};

export default ParticleNetwork;