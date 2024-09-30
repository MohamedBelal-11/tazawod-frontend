import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
  // Retrieve cookies server-side
  const cookieStore = cookies();
  const userLang = cookieStore.get('userLang'); // Get the userLang cookie

  // Perform server-side redirection
  if (userLang && (userLang.value === 'en')) {
    redirect('/en'); // Redirect to the English version of the site
  } else {
    redirect('/en'); // Default to the Arabic version
  }
}
