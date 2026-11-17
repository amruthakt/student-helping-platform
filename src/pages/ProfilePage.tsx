import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Mail, GraduationCap, CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { SafeImage } from '../components/SafeImage';
import { ResourceCard } from '../components/ResourceCard';
import { StatusLabel } from '../components/StatusLabel';
import { Modal } from '../components/Modal';
import { useCampus } from '../context/CampusContext';
import { DEMO_STUDENT_USER, DEPARTMENTS, SEMESTERS } from '../data/seedData';

export const ProfilePage: React.FC = () => {
  const { currentUser, resources, requests, updateProfile, demoLogin } = useCampus();
  const activeUser = currentUser || DEMO_STUDENT_USER;

  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState(activeUser.fullName);
  const [department, setDepartment] = useState(activeUser.department);
  const [semester, setSemester] = useState(activeUser.semester);
  const [bio, setBio] = useState(activeUser.bio || '');

  const myListings = resources.filter((r) => r.ownerId === activeUser.id);
  const completedRequests = requests.filter(
    (req) =>
      (req.ownerId === activeUser.id || req.requesterId === activeUser.id) &&
      req.status === 'Completed'
  );

  const openEditModal = () => {
    setFullName(activeUser.fullName);
    setDepartment(activeUser.department);
    setSemester(activeUser.semester);
    setBio(activeUser.bio || '');
    setEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      demoLogin();
    }
    updateProfile({
      fullName: fullName.trim() || activeUser.fullName,
      department,
      semester,
      bio: bio.trim(),
    });
    setEditOpen(false);
  };

  return (
    <DashboardShell breadcrumb="Profile" title="Student Profile">
      <div className="space-y-8">
        {/* Profile Header Card */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <SafeImage
              src={activeUser.avatarUrl}
              alt={activeUser.fullName}
              className="w-20 h-20 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div>
              <h2 className="font-display text-2xl font-bold text-[#172554]">
                {activeUser.fullName}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeUser.email}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {activeUser.department} · {activeUser.semester}
                  </span>
                </span>
              </div>
              {activeUser.bio && (
                <p className="mt-3 text-sm text-slate-600 max-w-xl leading-relaxed">
                  {activeUser.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <p className="text-xs text-slate-500 tabular-nums inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>
                <strong>{activeUser.completedExchanges}</strong> completed exchanges
              </span>
            </p>
          </div>
        </section>

        {/* My Listings Preview */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-[#172554]">
                My Listings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Resources currently associated with your profile.
              </p>
            </div>
            <Link
              to="/my-listings"
              className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              Manage all listings
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">
              You have no listings yet.{' '}
              <Link to="/add-resource" className="text-[#2563EB] font-semibold hover:underline">
                Publish a resource
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.slice(0, 3).map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </div>
          )}
        </section>

        {/* My Completed Exchanges */}
        <section>
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-[#172554]">
              My Completed Exchanges
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus swaps and handoffs marked as completed.
            </p>
          </div>

          {completedRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">
              No completed exchange logs yet. Once you mark an accepted request as completed, it will appear here.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {completedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-[#172554]">
                      {req.resourceTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.transactionType} · With{' '}
                      {req.ownerId === activeUser.id ? req.requesterName : req.ownerName} ·{' '}
                      {req.meetupSpot}
                    </p>
                  </div>
                  <StatusLabel status={req.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Student Profile"
        subtitle="Update your display name, department, and current semester."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-department"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Department
              </label>
              <select
                id="profile-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-semester"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Semester
              </label>
              <select
                id="profile-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-bio"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Short Campus Bio
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
};
