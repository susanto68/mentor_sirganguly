'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, ArrowLeft, Send, CheckCircle2, FileText } from 'lucide-react';
import { getJobListings, JobPosting } from '../lib/data/careerData';

interface JobPortalProps {
  onBack: () => void;
}

export default function JobPortal({ onBack }: JobPortalProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', portfolio: '', resumeName: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      const data = await getJobListings();
      setJobs(data);
      setLoading(false);
    }
    loadJobs();
  }, []);

  const jobTypes = ['All', 'Full-time', 'Hybrid', 'Remote', 'Contract'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType =
      selectedType === 'All' ||
      job.type === selectedType ||
      (selectedType === 'Hybrid' && job.location.includes('Hybrid')) ||
      (selectedType === 'Remote' && job.location.includes('Remote'));

    return matchesSearch && matchesType;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setApplyingJob(null);
      setApplyForm({ name: '', email: '', phone: '', portfolio: '', resumeName: '' });
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplyForm({ ...applyForm, resumeName: e.target.files[0].name });
    }
  };

  return (
    <div className="min-h-screen text-gray-100 pb-20 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Panel */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-cyan-500/30 transition-all text-sm text-cyan-400 group cursor-pointer mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to GrowthUniverse
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            💼 Professional Job Portal
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Secure high-impact opportunities in leading ecosystems, advanced tech labs, and creative agencies vetted by Sir Ganguly.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-10 items-center"
        >
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search careers, technologies, requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-panel border border-gray-800 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-600 text-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'glass-panel text-gray-400 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Listings Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 gap-4">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-cyan-400/80 animate-pulse text-sm">Accessing listings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-dashed border-gray-800 glass-panel"
          >
            <Briefcase size={48} className="mx-auto text-gray-600 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Careers Found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your keywords or filtering parameters.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)] group relative overflow-hidden"
              >
                {/* Visual Card Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        {job.type}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mt-1">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-cyan-400/80" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-cyan-400/80" />
                      {job.salary}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                    {job.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 py-3 text-center rounded-xl bg-gray-900/60 border border-gray-800 text-gray-300 hover:text-white hover:border-cyan-500/30 hover:bg-gray-800/60 transition-all text-sm font-semibold cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setApplyingJob(job)}
                    className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-[0_4px_15px_rgba(6,182,212,0.2)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.4)] cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Side Panel (Drawer) */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl glass-panel border-l border-gray-800 z-50 p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to listings
                </button>

                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedJob.type}
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-3 text-white">
                  {selectedJob.title}
                </h2>
                <p className="text-gray-400 font-medium text-base mb-6">{selectedJob.company}</p>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl glass-panel border-gray-800/50 mb-6 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">LOCATION</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-cyan-400" />
                      {selectedJob.location}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">ANNUAL SALARY</span>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-cyan-400" />
                      {selectedJob.salary}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-200 mb-2 uppercase tracking-wide">Role Description</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-200 mb-3 uppercase tracking-wide">Core Requirements</h4>
                  <ul className="space-y-2.5">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-800/80 pt-6">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 py-3 text-center border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setApplyingJob(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="flex-1 py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-md text-sm cursor-pointer"
                >
                  Apply to Role
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Apply Dialog */}
      <AnimatePresence>
        {applyingJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitted) setApplyingJob(null);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed w-full max-w-lg glass-panel border border-gray-800 rounded-3xl p-8 z-50 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500" />
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="apply-form"
                    onSubmit={handleApplySubmit}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-white">Apply for Role</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        Applying to <span className="text-cyan-400 font-semibold">{applyingJob.title}</span> at {applyingJob.company}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Susan Kumar"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-gray-800 focus:border-cyan-500 focus:outline-none text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email ID</label>
                        <input
                          type="email"
                          required
                          placeholder="susan@example.com"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass-panel border border-gray-800 focus:border-cyan-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass-panel border border-gray-800 focus:border-cyan-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Portfolio / GitHub Link</label>
                      <input
                        type="url"
                        placeholder="https://github.com/myportfolio"
                        value={applyForm.portfolio}
                        onChange={(e) => setApplyForm({ ...applyForm, portfolio: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-gray-800 focus:border-cyan-500 focus:outline-none text-white text-sm"
                      />
                    </div>

                    {/* Resume Upload Box */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Upload Resume (PDF)</label>
                      <div className="border border-dashed border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 text-center relative cursor-pointer glass-panel transition-all">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          required
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="mx-auto text-gray-500 mb-2 group-hover:text-cyan-400" size={24} />
                        {applyForm.resumeName ? (
                          <p className="text-cyan-400 text-xs font-semibold truncate">{applyForm.resumeName}</p>
                        ) : (
                          <>
                            <p className="text-gray-400 text-xs font-semibold">Select PDF Resume File</p>
                            <p className="text-gray-600 text-[10px] mt-0.5">Maximum size: 5MB</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setApplyingJob(null)}
                        className="flex-1 py-3 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer text-sm font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 text-sm cursor-pointer"
                      >
                        <Send size={15} /> Submit Application
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <CheckCircle2 size={64} className="text-emerald-400 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-white mb-2">Application Transmitted!</h3>
                    <p className="text-gray-400 text-sm max-w-sm">
                      Your resume has been parsed and transmitted to <span className="text-cyan-400 font-semibold">{applyingJob.company}</span>. Check your inbox for updates.
                    </p>
                    <div className="w-24 h-1 bg-cyan-500/20 rounded-full mt-6 overflow-hidden">
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="w-full h-full bg-cyan-400"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
