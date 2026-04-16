// Bootstrap review submission page
// Route: /r/[slug]
export default function ReviewPage({
  params,
}: {
  params: { slug: string }
}) {
  return <div>Leave a review for: {params.slug}</div>
}
