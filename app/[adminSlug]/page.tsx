import { notFound } from "next/navigation";
import { PixelAdminLogin } from "@/components/admin/PixelAdminLogin";
import { PixelAdminManager } from "@/components/admin/PixelAdminManager";
import { getPixelAdminSlug } from "@/lib/pixel-config";
import { isAdminAuthenticated } from "@/lib/pixel-auth";
import { getTikTokPixelCode } from "@/lib/pixel-storage";

type AdminPageProps = {
  params: Promise<{ adminSlug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PixelAdminPage({ params }: AdminPageProps) {
  const { adminSlug } = await params;
  const expectedSlug = getPixelAdminSlug();

  if (adminSlug !== expectedSlug) {
    notFound();
  }

  const isLoggedIn = await isAdminAuthenticated();
  let initialCode = "";

  if (isLoggedIn) {
    try {
      initialCode = await getTikTokPixelCode();
    } catch {
      initialCode = "";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        {isLoggedIn ? (
          <PixelAdminManager initialCode={initialCode} />
        ) : (
          <PixelAdminLogin />
        )}
      </div>
    </main>
  );
}
