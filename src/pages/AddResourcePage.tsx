import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Check } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { SafeImage } from '../components/SafeImage';
import { useCampus } from '../context/CampusContext';
import {
  ASSET_IMAGES,
  DEPARTMENTS,
  PRESET_RESOURCE_IMAGES,
  RESOURCE_CATEGORIES,
  SEMESTERS,
} from '../data/seedData';
import {
  ResourceCategory,
  ResourceCondition,
  TransactionType,
} from '../types/campus';

const CONDITIONS: ResourceCondition[] = ['New', 'Good', 'Used'];
const TRANSACTION_TYPES: TransactionType[] = ['Sell', 'Borrow', 'Exchange', 'Donate'];

export const AddResourcePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, resources, addResource, updateResource, demoLogin } = useCampus();

  const existing = id ? resources.find((r) => r.id === id) : undefined;
  const isEditing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [category, setCategory] = useState<ResourceCategory>(
    existing?.category || 'Textbooks'
  );
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl || ASSET_IMAGES.textbook);
  const [condition, setCondition] = useState<ResourceCondition>(
    existing?.condition || 'Good'
  );
  const [transactionType, setTransactionType] = useState<TransactionType>(
    existing?.transactionType || 'Sell'
  );
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : '25');
  const [borrowingDuration, setBorrowingDuration] = useState(
    existing?.borrowingDuration || '4 weeks'
  );
  const [preferredExchangeItem, setPreferredExchangeItem] = useState(
    existing?.preferredExchangeItem || ''
  );
  const [department, setDepartment] = useState(
    existing?.department || currentUser?.department || DEPARTMENTS[0]
  );
  const [semester, setSemester] = useState(
    existing?.semester || currentUser?.semester || SEMESTERS[2]
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setCategory(existing.category);
      setImageUrl(existing.imageUrl);
      setCondition(existing.condition);
      setTransactionType(existing.transactionType);
      setPrice(existing.price ? String(existing.price) : '25');
      setBorrowingDuration(existing.borrowingDuration || '4 weeks');
      setPreferredExchangeItem(existing.preferredExchangeItem || '');
      setDepartment(existing.department);
      setSemester(existing.semester);
    }
  }, [existing]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 4) {
      setError('Please enter a clear resource title (at least 4 characters).');
      return;
    }
    if (description.trim().length < 10) {
      setError('Please add a brief description of the resource condition and course use.');
      return;
    }
    if (transactionType === 'Sell' && (!price || Number(price) <= 0)) {
      setError('Please enter a valid student selling price.');
      return;
    }
    if (transactionType === 'Borrow' && !borrowingDuration.trim()) {
      setError('Please specify the borrowing duration.');
      return;
    }
    if (transactionType === 'Exchange' && !preferredExchangeItem.trim()) {
      setError('Please enter what academic item you would like in exchange.');
      return;
    }

    if (!currentUser) {
      demoLogin();
    }

    if (isEditing && existing) {
      updateResource(existing.id, {
        title,
        description,
        category,
        imageUrl,
        condition,
        transactionType,
        price: transactionType === 'Sell' ? Number(price) : undefined,
        borrowingDuration: transactionType === 'Borrow' ? borrowingDuration : undefined,
        preferredExchangeItem:
          transactionType === 'Exchange' ? preferredExchangeItem : undefined,
        department,
        semester,
      });
      navigate('/my-listings');
    } else {
      addResource({
        title,
        description,
        category,
        imageUrl,
        condition,
        transactionType,
        price: transactionType === 'Sell' ? Number(price) : undefined,
        borrowingDuration: transactionType === 'Borrow' ? borrowingDuration : undefined,
        preferredExchangeItem:
          transactionType === 'Exchange' ? preferredExchangeItem : undefined,
        department,
        semester,
      });
      navigate('/my-listings');
    }
  };

  return (
    <DashboardShell
      breadcrumb={isEditing ? 'My Listings / Edit' : 'Add Resource'}
      title={isEditing ? 'Edit Resource Listing' : 'Publish Academic Resource'}
    >
      <div className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div>
            <h2 className="font-display text-xl font-bold text-[#172554]">
              {isEditing ? 'Update resource details' : 'Share an item with your campus'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide accurate condition and course details so fellow students can find it quickly.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* Resource Title */}
          <div>
            <label
              htmlFor="resource-title"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Resource Title
            </label>
            <input
              id="resource-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Linear Algebra and Its Applications (5th Ed.)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="resource-description"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Description
            </label>
            <textarea
              id="resource-description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include course code, edition/model details, and any notes or accessories included..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none resize-none"
            />
          </div>

          {/* Category + Department + Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="resource-category"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Category
              </label>
              <select
                id="resource-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="resource-department"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Department
              </label>
              <select
                id="resource-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="resource-semester"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Semester
              </label>
              <select
                id="resource-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <span className="block text-xs font-semibold text-[#1E293B] mb-2">
              Condition
            </span>
            <div className="grid grid-cols-3 gap-3">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setCondition(cond)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    condition === cond
                      ? 'border-[#172554] bg-[#172554] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <span className="block text-xs font-semibold text-[#1E293B] mb-2">
              Transaction Type
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRANSACTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransactionType(type)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors ${
                    transactionType === type
                      ? 'border-[#2563EB] bg-[#2563EB] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Fields */}
          {transactionType === 'Sell' && (
            <div>
              <label
                htmlFor="resource-price"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Selling Price (USD)
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <input
                  id="resource-price"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono tabular-nums focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
          )}

          {transactionType === 'Borrow' && (
            <div>
              <label
                htmlFor="borrowing-duration"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Borrowing Duration
              </label>
              <input
                id="borrowing-duration"
                type="text"
                required
                value={borrowingDuration}
                onChange={(e) => setBorrowingDuration(e.target.value)}
                placeholder="e.g., 4 weeks, Midterm block, or 1 Semester"
                className="w-full max-w-md px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          )}

          {transactionType === 'Exchange' && (
            <div>
              <label
                htmlFor="preferred-exchange"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Preferred Exchange Item
              </label>
              <input
                id="preferred-exchange"
                type="text"
                required
                value={preferredExchangeItem}
                onChange={(e) => setPreferredExchangeItem(e.target.value)}
                placeholder="e.g., Discrete Mathematics textbook or drafting ruler set"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          )}

          {transactionType === 'Donate' && (
            <div className="p-3.5 rounded-lg bg-[#16A34A]/8 border border-[#16A34A]/20 text-xs text-[#172554]">
              This resource will be listed as <strong>Free</strong> for students on campus.
            </div>
          )}

          {/* Resource Image Upload + Presets */}
          <div>
            <span className="block text-xs font-semibold text-[#1E293B] mb-2">
              Resource Image
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              <div className="sm:col-span-5 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={imageUrl}
                  alt="Resource preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <label className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#2563EB] hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#172554]">
                    Upload photo from device
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG or JPG recommended
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>

                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                    Or choose a studio category photo:
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_RESOURCE_IMAGES.map((preset) => {
                      const selected = imageUrl === preset.url;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          title={preset.label}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selected
                              ? 'border-[#2563EB]'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          <SafeImage
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          {selected && (
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Publish Resource'}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
};
