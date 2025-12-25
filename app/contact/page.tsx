import React from 'react'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-16 text-center mt-8">運営会社</h1>

          {/* Company Information Table */}
          <div className="w-full flex flex-col border border-gray-300">
            <div className="w-full flex flex-row text-black border-b border-gray-300">
              <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">
                社名
              </p>
              <p className="w-4/5 text-lg text-start px-4 py-6">asoviva合同会社</p>
            </div>
            <div className="w-full flex flex-row text-black border-b border-gray-300">
              <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">
                設立
              </p>
              <p className="w-4/5 text-lg text-start px-4 py-6">2025年9月1日</p>
            </div>
            <div className="w-full flex flex-row text-black border-b border-gray-300">
              <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">
                所在地
              </p>
              <p className="w-4/5 text-lg text-start px-4 py-6">
                東京都渋谷区渋谷区上原1丁目17-14 上原ハウス201
              </p>
            </div>
            <div className="w-full flex flex-row text-black border-b border-gray-300">
              <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">
                代表社員
              </p>
              <p className="w-4/5 text-lg text-start px-4 py-6">三好 剛</p>
            </div>
            <div className="w-full flex flex-row text-black border-b border-gray-300">
              <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">
                事業内容
              </p>
              <p className="w-4/5 text-lg text-start px-4 py-6">
                クラウドファンディング、動画制作事業の企画・開発・運営
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
