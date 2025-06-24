import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompanyPublicData } from "@/types/company";

interface EditCompanyProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialData: CompanyPublicData;
  onSave: (data: Partial<CompanyPublicData>, bannerFile?: File, logoFile?: File) => Promise<void>;
}

const EditCompanyProfileModal: React.FC<EditCompanyProfileModalProps> = ({ open, onClose, initialData, onSave }) => {
  const [form, setForm] = useState<Partial<CompanyPublicData>>(initialData);
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialData);
    setBannerFile(undefined);
    setLogoFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form, bannerFile, logoFile);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
        </DialogHeader>
        <form
          key={initialData.id + (initialData.updatedAt || "") + (open ? "open" : "")}
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-auto px-2"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input name="name" value={form.name || ""} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <Input name="tagline" value={form.tagline || ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About Us</label>
            <Textarea name="aboutUs" value={form.aboutUs || ""} onChange={handleChange} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About Us Poster URL</label>
            <Input name="aboutUsPosterUrl" value={form.aboutUsPosterUrl || ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input name="website" value={form.website || ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <Input name="industry" value={form.industry || ""} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Min Company Size</label>
              <Input name="minCompanySize" type="number" value={form.minCompanySize !== undefined && form.minCompanySize !== null ? String(form.minCompanySize) : ""} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Max Company Size</label>
              <Input name="maxCompanySize" type="number" value={form.maxCompanySize !== undefined && form.maxCompanySize !== null ? String(form.maxCompanySize) : ""} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input name="address" value={form.address || ""} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">City</label>
              <Input name="city" value={form.city || ""} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">State</label>
              <Input name="state" value={form.state || ""} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input name="country" value={form.country || ""} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <Input name="zip" value={form.zip || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input name="email" value={form.email || ""} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input name="phone" value={form.phone || ""} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <Input name="tags" value={form.tags || ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Foundation Year</label>
            <Input name="foundationYear" type="number" value={form.foundationYear !== undefined && form.foundationYear !== null ? String(form.foundationYear) : ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Banner Image</label>
            <Input type="file" accept="image/*" onChange={handleBannerChange} ref={fileInputRef} />
            {bannerFile && <div className="mt-2 text-xs text-muted-foreground">Selected: {bannerFile.name}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo Image</label>
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
            {logoFile && <div className="mt-2 text-xs text-muted-foreground">Selected: {logoFile.name}</div>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyProfileModal;