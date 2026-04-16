// Public provider profile page
// Route: /p/[slug]
export default function ProviderProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  return <div>Provider profile: {params.slug}</div>
}
