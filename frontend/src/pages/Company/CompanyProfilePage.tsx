import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Globe, Mail, Phone, MapPin, Tag, Users, Calendar } from "lucide-react";
import { companyApi } from "@/services/companyApi";
import { CompanyPublicData } from "@/types/company";
import EditCompanyProfileModal from "@/components/company/EditCompanyProfileModal";
import CompanyLayout from "@/components/layout/CompanyLayout";

const CompanyProfilePage: React.FC = () => {
  const [company, setCompany] = useState<CompanyPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        // Assumes company user can only see their own profile
        const res = await companyApi.getCompanyById("me");
        // Map backend fields to frontend fields
        setCompany({
          ...res,
          companyLogo: res.logo_url,
          bannerUrl: res.banner_url,
        });
      } catch {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSaveProfile = async (data: Partial<CompanyPublicData>, bannerFile?: File, logoFile?: File) => {
    await companyApi.updateProfile({ ...company, ...data }, bannerFile, logoFile);
    // Refresh company data
    const res = await companyApi.getCompanyById("me");
    setCompany({
      ...res,
      companyLogo: res.logo_url,
      bannerUrl: res.banner_url,
    });
    setEditOpen(false);
  };

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Banner with overlayed logo */}
          <div className="relative mb-8 bg-background">
            {company?.bannerUrl ? (
              <img src={company.bannerUrl} alt="Company Banner" className="w-full h-48 object-cover rounded-2xl shadow-lg bg-background" />
            ) : (
              <div className="w-full h-48 rounded-2xl bg-background flex items-center justify-center border border-dashed border-blue-200 shadow-lg">
                <span className="text-blue-400 text-lg font-semibold opacity-60">No Banner Available</span>
              </div>
            )}
            {/* Logo overlay */}
            <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 bg-background">
              <div className="rounded-full bg-background shadow-xl p-2 border-4 border-background">
                {company?.companyLogo ? (
                  <img src={company.companyLogo} alt={company.name} className="h-24 w-24 rounded-full object-cover bg-background" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center text-4xl font-bold text-gray-500">
                    <Building className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>
            <button
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-blue-700 px-4 py-2 rounded shadow text-sm font-semibold border border-blue-200 z-10"
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </button>
          </div>
          <div className="h-12" /> {/* Spacer for logo overlay */}
          <EditCompanyProfileModal
            key={(company?.id || 0) + (company?.updatedAt || "")}
            open={!!editOpen && !!company}
            onClose={() => setEditOpen(false)}
            initialData={company || { id: 0, name: "" }}
            onSave={handleSaveProfile}
          />
          <Card className="shadow-xl border-0 mb-8 p-6 rounded-2xl bg-background">
            <CardHeader className="flex flex-col items-center gap-2 py-4 bg-background">
              <div className="text-3xl font-bold text-blue-800 mb-1 text-center">{company?.name}</div>
              {company?.tagline && <div className="text-base text-muted-foreground italic text-center mb-2">{company.tagline}</div>}
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {company?.tags?.split(",").map((tag: string) => (
                  <span key={tag.trim()} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"><Tag className="h-3 w-3" />{tag.trim()}</span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="bg-background">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-blue-400" /> Company Size</div>
                  <div className="text-muted-foreground mb-3">{(company?.minCompanySize && company?.maxCompanySize) ? `${company.minCompanySize} - ${company.maxCompanySize} employees` : <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><MapPin className="h-4 w-4 text-blue-400" /> Address</div>
                  <div className="text-muted-foreground mb-3">{company?.address || <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><Globe className="h-4 w-4 text-blue-400" /> Website</div>
                  <div className="text-muted-foreground mb-3">{company?.website ? <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{company.website}</a> : <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><Calendar className="h-4 w-4 text-blue-400" /> Foundation Year</div>
                  <div className="text-muted-foreground mb-3">{company?.foundationYear || <span className="italic text-red-400">Not specified</span>}</div>
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><Mail className="h-4 w-4 text-blue-400" /> Email</div>
                  <div className="text-muted-foreground mb-3">{company?.email || <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><Phone className="h-4 w-4 text-blue-400" /> Phone</div>
                  <div className="text-muted-foreground mb-3">{company?.phone || <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1"><MapPin className="h-4 w-4 text-blue-400" /> Location</div>
                  <div className="text-muted-foreground mb-3">{[company?.city, company?.state, company?.country].filter(Boolean).join(", ") || <span className="italic text-red-400">Not specified</span>}</div>
                  <div className="font-semibold flex items-center gap-2 mb-1">Zip Code</div>
                  <div className="text-muted-foreground mb-3">{company?.zip || <span className="italic text-red-400">Not specified</span>}</div>
                </div>
              </div>
              <div className="mt-8 mb-4">
                <div className="font-semibold mb-1 text-lg flex items-center gap-2"><span>About Us</span></div>
                <div className="text-muted-foreground whitespace-pre-line bg-background rounded p-3 min-h-[60px]">{company?.aboutUs || <span className="italic text-red-400">Not specified</span>}</div>
              </div>
              {company?.aboutUsPosterUrl && (
                <div className="mb-4">
                  <div className="font-semibold mb-1">About Us Poster</div>
                  <img src={company.aboutUsPosterUrl} alt="About Us Poster" className="w-full h-32 object-cover rounded shadow bg-background" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfilePage;
