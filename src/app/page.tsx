import { redirect } from 'next/navigation'

/**
 * Home page - redirects to stories list
 */
export default function Home() {
  redirect('/stories')
}
