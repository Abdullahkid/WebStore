import { redirect } from 'next/navigation';

export default function Home() {
  // For now, redirect to a sample store or show a landing page
  // You can customize this as needed
  return (
    <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#009CB9] to-[#16DAFF] rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">🏪</span>
        </div>
        <h1 className="text-3xl font-bold text-[#212121] mb-4">
          Downxtown Web Store
        </h1>
        <p className="text-[#757575] mb-6">
          Discover amazing products from local stores. Visit a store profile by going to:
        </p>
        <div className="bg-white p-4 rounded-lg border text-sm font-mono text-[#009CB9] mb-6">
          /store/[store-id]
        </div>
        <p className="text-xs text-[#757575]">
          Replace [store-id] with an actual store ID from your database
        </p>
      </div>
    </div>
  );
}
