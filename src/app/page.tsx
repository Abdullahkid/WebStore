export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DownXtown Webstore
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This is the webstore platform for individual sellers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Looking for a store?
          </h2>
          <p className="text-gray-600 mb-6">
            Each seller has their own subdomain. To visit a store, use:
          </p>
          <div className="bg-gray-50 rounded-md p-4 font-mono text-sm text-left space-y-2">
            <div className="text-blue-600">
              <span className="text-gray-700">Example:</span> omega.downxtown.com
            </div>
            <div className="text-blue-600">
              <span className="text-gray-700">Format:</span> [storename].downxtown.com
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            For the main DownXtown platform, visit{' '}
            <a 
              href="https://downxtown.com" 
              className="text-blue-600 hover:underline"
            >
              downxtown.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
