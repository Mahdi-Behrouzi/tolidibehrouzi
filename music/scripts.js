import Head from 'next/head';
import Link from 'next/link';

export default function BlogHome() {
  // فرض می‌کنیم این داده‌ها از دیتابیس یا فایل‌های مارک‌داون (MDX) خوانده شده‌اند
  const posts = [
    { id: 1, title: 'چگونه یک برنامه‌نویس بهتر شویم؟', date: '۱۴۰۵/۰۴/۰۸', excerpt: 'در این مقاله به بررسی الگوهای طراحی...' },
    { id: 2, title: 'معرفی Next.js برای توسعه وب', date: '۱۴۰۵/۰۴/۱۰', excerpt: 'نکست جی‌اس یکی از قدرتمندترین ابزارهای ریکت است...' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      <Head>
        <title>وبلاگ تخصصی</title>
        <meta name="description" content="وبلاگ شخصی توسعه‌یافته با تکنولوژی Next.js" />
      </Head>

      {/* هدر سایت */}
      <header className="bg-white shadow-sm py-6 mb-10">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900">لوگوی وبلاگ</h1>
          <nav className="space-x-4 space-x-reverse">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">خانه</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">درباره من</Link>
          </nav>
        </div>
      </header>

      {/* لیست پست‌ها */}
      <main className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">آخرین مقالات</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                <Link href={/posts/${post.id}} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
              <Link href={/posts/${post.id}} className="text-blue-600 font-semibold hover:underline">
                ادامه مطلب ←
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
