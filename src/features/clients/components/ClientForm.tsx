import React, { useMemo, useState } from 'react';
import { Package, AddOn, Profile, Card, PromoCode, ClientType } from '../../../types';
import RupiahInput from '../../../shared/form/RupiahInput';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export const initialClientFormState = {
    clientId: '',
    clientName: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    clientType: ClientType.DIRECT,
    projectId: '',
    projectName: '',
    projectType: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    packageId: '',
    selectedAddOnIds: [] as string[],
    durationSelection: '',
    unitPrice: undefined as number | undefined,
    dp: '',
    dpDestinationCardId: '',
    notes: '',
    accommodation: '',
    driveLink: '',
    promoCodeId: '',
    address: '',
};

interface ClientFormProps {
    formData: typeof initialClientFormState;
    setFormData: React.Dispatch<React.SetStateAction<typeof initialClientFormState>>;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    handleCloseModal: () => void;
    packages: Package[];
    addOns: AddOn[];
    userProfile: Profile;
    modalMode: 'add' | 'edit';
    cards: Card[];
    promoCodes: PromoCode[];
}

const ClientForm: React.FC<ClientFormProps> = ({ formData, setFormData, handleFormChange, handleFormSubmit, handleCloseModal, packages, addOns, userProfile, modalMode, cards, promoCodes }) => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const availableRegions = useMemo(() => {
        const regions = packages
            .map(p => p.region)
            .filter((r): r is string => !!r);
        return Array.from(new Set(regions));
    }, [packages]);

    const visiblePackages = useMemo(() => {
        if (!selectedRegion) return packages;
        return packages.filter(p => p.region === selectedRegion);
    }, [packages, selectedRegion]);

    const visibleAddOns = useMemo(() => {
        if (!selectedRegion) return addOns;
        return addOns.filter(a => !a.region || a.region === selectedRegion);
    }, [addOns, selectedRegion]);

    const priceCalculations = useMemo(() => {
        const selectedPackage = packages.find(p => p.id === formData.packageId);
        const packagePrice = (formData.unitPrice && Number(formData.unitPrice) > 0) ? Number(formData.unitPrice) : (selectedPackage?.price || 0);

        const addOnsPrice = addOns
            .filter(addon => formData.selectedAddOnIds.includes(addon.id))
            .reduce((sum, addon) => sum + addon.price, 0);

        let totalProjectBeforeDiscount = packagePrice + addOnsPrice;
        let discountAmount = 0;
        let discountApplied = 'N/A';
        const promoCode = promoCodes.find(p => p.id === formData.promoCodeId);

        if (promoCode) {
            if (promoCode.discountType === 'percentage') {
                discountAmount = (totalProjectBeforeDiscount * promoCode.discountValue) / 100;
                discountApplied = `${promoCode.discountValue}%`;
            } else {
                discountAmount = promoCode.discountValue;
                discountApplied = formatCurrency(promoCode.discountValue);
            }
        }

        const totalProject = totalProjectBeforeDiscount - discountAmount;
        const remainingPayment = totalProject - Number(formData.dp);

        return { packagePrice, addOnsPrice, totalProject, remainingPayment, discountAmount, discountApplied };
    }, [formData.packageId, formData.selectedAddOnIds, formData.dp, formData.promoCodeId, packages, addOns, promoCodes]);

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-5">
                    <h4 className="text-base font-semibold text-brand-accent border-b border-brand-border pb-2">Informasi Pengantin</h4>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Nama Pengantin</label>
                        <input type="text" name="clientName" value={formData.clientName} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" placeholder="Masukkan nama pengantin" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Jenis</label>
                            <select name="clientType" value={formData.clientType} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" required>
                                {Object.values(ClientType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Telepon</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" placeholder="0812..." required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" placeholder="email@example.com" required />
                    </div>

                    <h4 className="text-base font-semibold text-brand-accent border-b border-brand-border pb-2 pt-4">Informasi Acara Pernikahan</h4>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Nama Acara</label>
                        <input type="text" name="projectName" value={formData.projectName} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" placeholder="Wedding of..." required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Tanggal</label>
                            <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Kota</label>
                            <input type="text" name="location" value={formData.location} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" placeholder="Jakarta..." />
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <h4 className="text-base font-semibold text-brand-accent border-b border-brand-border pb-2">Package & Pembayaran</h4>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Pilih Package</label>
                            <select name="packageId" value={formData.packageId} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" required>
                                <option value="">Pilih Package...</option>
                                {visiblePackages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-brand-text-secondary font-medium">Harga Dasar</span>
                                <span className="text-brand-text-light font-bold">{formatCurrency(priceCalculations.packagePrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-brand-text-secondary font-medium">Add-Ons</span>
                                <span className="text-brand-text-light font-bold">+{formatCurrency(priceCalculations.addOnsPrice)}</span>
                            </div>
                            {priceCalculations.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-brand-success font-medium">Diskon</span>
                                    <span className="text-brand-success font-bold">-{formatCurrency(priceCalculations.discountAmount)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-brand-border flex justify-between items-center">
                                <span className="text-brand-text-secondary font-bold">TOTAL NILAI</span>
                                <span className="text-lg font-black text-brand-accent">{formatCurrency(priceCalculations.totalProject)}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Uang DP (IDR)</label>
                                <RupiahInput value={formData.dp} onChange={(val) => setFormData(prev => ({ ...prev, dp: val }))} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" />
                            </div>
                            {Number(formData.dp) > 0 && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Setor Ke</label>
                                    <select name="dpDestinationCardId" value={formData.dpDestinationCardId} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-text-primary focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all" required>
                                        <option value="">Pilih Tujuan...</option>
                                        {cards.map(c => <option key={c.id} value={c.id}>{c.bankName} ({c.cardHolderName})</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-6 border-t border-brand-border">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl border border-brand-border text-brand-text-secondary hover:bg-white/5 transition-all">Batal</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-accent text-white font-bold shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {modalMode === 'add' ? 'Simpan Pengantin' : 'Perbarui Data'}
                </button>
            </div>
        </form>
    );
};

export default ClientForm;
