import React from 'react'

const CommercialTranPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-16 text-center mt-8">特定商取引法に基づく表記</h1>
                    <div className="width-[1093px] height-[900px] flex flex-col justify-start border-collapse border border-gray-300">
                        <div className="w-full h-auto flex flex-row text-black space-x-8 items-center border-b border-gray-300">
                            <p className="py-8 space-x-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5">事業者</p>
                            <p className="w-4/5 text-lg text-start space-x-4">Asoviva合同会社</p>
                        </div>
                        <div className="w-full h-auto flex flex-row text-black space-x-8 items-center border-b border-gray-300">
                            <p className="py-8 space-x-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5">運営責任者</p>
                            <p className="w-4/5 text-lg text-start space-x-4">三好 剛</p>
                        </div>
                        <div className="w-full h-auto flex flex-row text-black space-x-8 items-center border-b border-gray-300">
                            <p className="py-8 space-x-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5">所在地</p>
                            <p className="w-4/5 text-lg text-start space-x-4">宮城県仙台市太白区ひより台26番11号</p>
                        </div>
                        <div className="w-full h-auto flex flex-row text-black space-x-8 items-center border-b border-gray-300">
                            <p className="py-8 space-x-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5">お問い合わせ</p>
                            <p className="h-full w-4/5 text-lg text-start space-x-4"><a href="https://camp-fire.jp/inquiries" target="_blank" rel="noopener noreferrer" className="decoration-none underline">お問い合わせ</a><br />
                            プロジェクトオーナーへのお問い合わせは、各プロジェクトページよりメッセージをご利用ください。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommercialTranPage;