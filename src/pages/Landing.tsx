import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/components/Logo";
import {
  LayoutDashboard, Users, MessageSquare, Brain, Bell, Shield,
  CheckCircle2, ArrowRight, Star, Zap, BarChart3, FolderKanban,
  ChevronRight, Mail, Github, Twitter
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.from(".hero-subtitle", { y: 40, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
      gsap.from(".hero-buttons", { y: 30, opacity: 0, duration: 0.8, delay: 0.6, ease: "power3.out" });
      gsap.from(".hero-visual", { scale: 0.8, opacity: 0, duration: 1.2, delay: 0.4, ease: "elastic.out(1, 0.5)" });
      gsap.from(".hero-blob", { scale: 0, rotation: -180, duration: 2, delay: 0.2, ease: "elastic.out(1, 0.4)" });

      // Stats counter
      gsap.from(".stat-item", {
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"
      });

      // Features
      gsap.from(".feature-card", {
        scrollTrigger: { trigger: featuresRef.current, start: "top 80%" },
        y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out"
      });
      // Ensure features are visible if ScrollTrigger fails
      gsap.set(".feature-card", { opacity: 1, delay: 0.5 });

      // Pricing
      gsap.from(".pricing-card", {
        scrollTrigger: { trigger: pricingRef.current, start: "top 80%" },
        y: 50, opacity: 0, stagger: 0.2, duration: 0.8, ease: "power3.out"
      });
      // Ensure pricing cards are visible if ScrollTrigger fails
      gsap.set(".pricing-card", { opacity: 1, delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  const features = [
    { icon: FolderKanban, title: "Project Management", desc: "Create & manage projects with task boards, priorities, and tracking." },
    { icon: Users, title: "Team Collaboration", desc: "Invite members, assign roles, and work together seamlessly." },
    { icon: MessageSquare, title: "Real-time Discussion", desc: "Group chat within projects for instant team communication." },
    { icon: Brain, title: "AI Planning", desc: "AI-powered task planning and intelligent project creation." },
    { icon: Bell, title: "Smart Notifications", desc: "Accept/reject invites and stay updated with real-time alerts." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Track progress with working graphs and daily activity logs." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 clay-nav px-6 py-3 flex items-center gap-8 max-w-4xl w-[95%]">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Link to="/signin" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link to="/signup" className="clay-button bg-primary text-primary-foreground px-5 py-2 text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 relative">
        {/* Blobs */}
        <div className="hero-blob absolute top-20 left-10 w-72 h-72 bg-primary/10 clay-blob blur-3xl" />
        <div className="hero-blob absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 clay-blob blur-3xl" />
        <div className="hero-blob absolute top-40 right-20 w-48 h-48 bg-accent/10 clay-blob blur-2xl" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="hero-title">
            <span className="clay-badge inline-block bg-primary/10 text-primary px-4 py-1.5 text-sm mb-6">
              ✨ Project Management Reimagined
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Manage Projects
              <br />
              <span className="gradient-text">Like Never Before</span>
            </h1>
          </div>
          <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">
            SynergySphere brings your team together with AI-powered planning, real-time collaboration, and beautiful claymorphic design.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="clay-button bg-primary text-primary-foreground px-8 py-3.5 text-lg flex items-center gap-2 font-bold">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="clay-button bg-card text-foreground px-8 py-3.5 text-lg font-bold">
              Explore Features
            </a>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual mt-16 max-w-4xl mx-auto">
            <div className="clay-card p-6 md:p-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="clay-card-inset p-4 col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-xs font-bold text-muted-foreground">TO-DO</span>
                  </div>
                  {["Design System", "API Integration", "User Testing"].map((t, i) => (
                    <div key={i} className="clay-card p-3 mb-2 text-sm font-semibold">{t}</div>
                  ))}
                </div>
                <div className="clay-card-inset p-4 col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-xs font-bold text-muted-foreground">IN PROCESS</span>
                  </div>
                  {["Dashboard UI", "Auth Flow"].map((t, i) => (
                    <div key={i} className="clay-card p-3 mb-2 text-sm font-semibold">{t}</div>
                  ))}
                </div>
                <div className="clay-card-inset p-4 col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-muted-foreground">DONE</span>
                  </div>
                  {["Project Setup", "Wireframes"].map((t, i) => (
                    <div key={i} className="clay-card p-3 mb-2 text-sm font-semibold">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50K+", label: "Projects Created" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "Rating" },
          ].map((s, i) => (
            <div key={i} className="stat-item clay-card p-6 text-center">
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-sm font-semibold text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="clay-badge inline-block bg-accent/10 text-accent px-4 py-1.5 text-sm mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-black">
              Everything You <span className="gradient-text">Need</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="feature-card clay-card p-6 group cursor-pointer" style={{ opacity: 1 }}>
                <div className="clay-card-inset w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground font-medium text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="clay-badge inline-block bg-secondary/10 text-secondary px-4 py-1.5 text-sm mb-4">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free", price: "$0", period: "/forever",
                features: ["Up to 5 Projects", "Basic Task Board", "Team Invitations", "Email Notifications"],
                cta: "Get Started", highlight: false
              },
              {
                name: "Pro", price: "$12", period: "/month",
                features: ["Unlimited Projects", "AI Task Planning", "Advanced Analytics", "Priority Support", "Real-time Chat"],
                cta: "Upgrade to Pro", highlight: true
              },
              {
                name: "Enterprise", price: "$49", period: "/month",
                features: ["Everything in Pro", "Custom Integrations", "Admin Controls", "Dedicated Support", "SLA Guarantee"],
                cta: "Contact Sales", highlight: false
              },
            ].map((plan, i) => (
              <div key={i} className={`pricing-card clay-card p-8 ${plan.highlight ? "ring-2 ring-primary scale-105 relative" : ""}`} style={{ opacity: 1 }}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 clay-badge bg-primary text-primary-foreground px-4 py-1 text-xs">
                    POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground font-medium">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`clay-button block text-center py-3 font-bold ${
                    plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto clay-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-muted-foreground font-medium mb-8 max-w-lg mx-auto">
              Join thousands of teams already using SynergySphere to manage their projects more effectively.
            </p>
            <Link to="/signup" className="clay-button bg-primary text-primary-foreground px-8 py-3.5 text-lg inline-flex items-center gap-2 font-bold">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <Logo size="md" />
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                Next-gen project management with AI-powered collaboration.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/signin" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
            <p className="text-sm text-muted-foreground font-medium">© 2026 SynergySphere. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="clay-card-inset w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="clay-card-inset w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="clay-card-inset w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
