interface HeadProps {
  params: { seccion: string; link: string }
}

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')

export default function Head({ params }: HeadProps) {
  const ampHref = `${BASE_URL}/amp/${params.seccion}/${params.link}`

  return (
    <>
      <link rel="amphtml" href={ampHref} />
    </>
  )
}
