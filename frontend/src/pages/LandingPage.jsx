import React from "react";

import {
  Code2,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTypingEffect } from "../hooks/useTypingEffect";
import GradientText from "@/components/GradientText.jsx";



export default function LandingPage() {

  // Typing animation text
  

  const animatedTitle = useTypingEffect("Code Together, Learn Faster", 50);


  const navigate = useNavigate();

  const Join = () => {
    navigate("/joinroom");
  };

  const features = [
    {
      icon: Code2,
      title: "Real-Time Collaboration",
      description:
        "Code together with your team in real-time. See cursors, edits, and changes instantly.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast Compilation",
      description:
        "Execute code in milliseconds with our optimized cloud infrastructure.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Team Workspaces",
      description:
        "Create shared workspaces for your projects and invite unlimited collaborators.",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Enterprise-grade security with encrypted connections and private repositories.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["5 Projects", "100 Compilations/day", "2 Team Members", "Community Support"],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      features: [
        "Unlimited Projects",
        "Unlimited Compilations",
        "10 Team Members",
        "Priority Support",
        "Advanced Analytics",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Unlimited Team Members",
        "Dedicated Support",
        "Custom Infrastructure",
        "SLA Guarantee",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-950 to-black text-white overflow-auto">

      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/10 bg-gray-900/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[12px] flex items-center justify-center shadow-lg">
              <span className="tracking-tight">DS</span>
            </div>
            <span className="text-xl tracking-tight">DevSync</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={Join} className="px-4 py-2 text-gray-300 hover:text-white">
              Sign In
            </button>
            <button
              onClick={Join}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[12px] shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Real-time collaborative coding platform</span>
          </div>

          {/* Smooth Typing Title */}
     <GradientText animationSpeed={4} className="text-5xl font-bold p-4">
  {animatedTitle}
</GradientText>




          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            The future of collaborative development. Write, compile, and execute code in real-time
            with your team. Multiple languages, instant feedback, zero setup.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={Join}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-[12px] shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] flex items-center gap-2"
            >
              <span className="text-lg">Start Coding Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-[12px] hover:bg-white/10">
              Watch Demo
            </button>
          </div>

          {/* Hero Image */}
          <div className="mt-20 rounded-[12px] overflow-hidden border border-white/10 bg-gray-900/40 backdrop-blur-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
              <div className="text-center">
                <Code2 className="w-20 h-20 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">Live Editor Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400">Everything you need to collaborate and code efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-900/40 rounded-[12px] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-[12px] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400">Choose the plan that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-[12px] border backdrop-blur-xl ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-105"
                  : "bg-gray-900/40 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
              }`}
            >
              {plan.highlighted && (
                <div className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs mb-4">Most Popular</div>
              )}

              <h3 className="text-2xl mb-2">{plan.name}</h3>

              <div className="mb-6">
                <span className="text-4xl">{plan.price}</span>
                <span className="text-gray-400 ml-2">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-[12px] ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-gray-900/40 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[12px]"></div>
                <span className="text-lg">DevSync</span>
              </div>
              <p className="text-gray-400 text-sm">
                Real-time collaborative code compilation platform for modern development teams.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Connect</h4>
              <div className="flex gap-3">
                <a className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-white/10">
                  <Github className="w-5 h-5" />
                </a>
                <a className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </a>
                <a className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-white/10">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            © 2025 DevSync. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
