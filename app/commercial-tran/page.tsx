import React from 'react'

const CommercialTranPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-16 text-center mt-8">特定商取引法に基づく表記</h1>

                    {/* First Section: 特定商取引法に基づく表記 */}
                    <div className="w-full flex flex-col border border-gray-300 mb-16">
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">事業者</p>
                            <p className="w-4/5 text-lg text-start px-4 py-6">Asoviva合同会社</p>
                        </div>
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">運営責任者</p>
                            <p className="w-4/5 text-lg text-start px-4 py-6">三好剛</p>
                        </div>
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">所在地</p>
                            <p className="w-4/5 text-lg text-start px-4 py-6">宮城県仙台市太白区ひより台26番11号</p>
                        </div>
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">お問い合わせ</p>
                            <div className="w-4/5 text-lg text-start px-4 py-6">
                                <p>プロジェクトオーナーへのお問い合わせは、各プロジェクトページよりメッセージをご利用ください。</p>
                            </div>
                        </div>
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">支払い方法</p>
                            <div className="w-4/5 text-lg text-start px-4 py-6 space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">プロジェクトオーナーの支払い方法</p>
                                    <p>手数料の支払いは、総支援金額から手数料相当額を差し引くことにより行われます。なお、銀行への振込手数料等その他の費用は弊社が負担します。</p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-2">支援者の支払い方法</p>
                                    <p>手数料は、プロジェクトオーナーに対する支援金の支払いと同時に、支援金の支払いと同様の方法にて支払われます。</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-row text-black border-b border-gray-300">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">支払い時期</p>
                            <div className="w-4/5 text-lg text-start px-4 py-6 space-y-4">
                                <p>各プロジェクトが募集期間内に成立した場合に限り、募集期間終了日の翌日にお支払いに関する「プロジェクト明細」を発行し、プロジェクトオーナーにより弊社所定の方法でご確認いただいた後に、弊社の手数料相当額を支援金額から差し引くことによりお支払いいたします。</p>
                                <p>「ツクルTVコミュニティ」方式の場合は、月末締めの翌月16日以降に「プロジェクト明細」を発行し、プロジェクトオーナーにより当社所定の方法でご確認いただいた後に、当社の手数料相当額を支援金額から差し引くことによりお支払いいたします。</p>
                            </div>
                        </div>
                        <div className="w-full flex flex-row text-black">
                            <p className="py-6 px-4 text-lg border-r border-gray-300 bg-[#F5F7F9] w-1/5 font-semibold">返金・キャンセル</p>
                            <div className="w-4/5 text-lg text-start px-4 py-6 space-y-4">
                                <p>本サービスに掲載が開始されたプロジェクトは、原則、当社の承諾なく掲載を取り下げること、および、募集期間や目標金額、リターンの内容や金額を変更することはできません。ただし、プロジェクトが募集期限終了前で、かつ目標金額に達成していない場合に、やむを得ない理由でプロジェクトの開始が実行できないとプロジェクトオーナーが判断した場合は、プロジェクトオーナーは速やかに当社までその旨を通知した上、当社が承諾した場合はプロジェクトの掲載を終了することができます。</p>
                                <p>なお、各プロジェクトにおいて募集期間内にプロジェクトが成立した場合の返金・キャンセルの受付は、一切お断りさせていただきます。</p>
                                <p>プロジェクト掲載後の変更について、詳しくはお問い合わせください。</p>
                            </div>
                        </div>
                    </div>

                    {/* Second Section: プロジェクトにおけるリターンの販売に関する共通事項 */}
                    <div className="w-full mb-16 bg-[#F5F7F9] py-16 px-[46px]">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">プロジェクトにおけるリターンの<br />
                            販売に関する共通事項</h2>

                        <div className="space-y-6 mb-8 text-black">
                            <p className="text-lg">
                                各プロジェクトへの支援により、プロジェクトオーナーと支援者との間で支援契約が成立します。支援契約によるリターンはプロジェクトオーナーによって提供され、当社はリターンの履行またはそれに関するトラブルについて関与致しません旨ご了承ください。
                            </p>
                            <p className="text-lg">
                                支援契約が特定商取引法上の「通信販売」に該当する場合における表示事項のうちすべてのプロジェクトに共通する項目は以下の通りです。こちらに記載のない項目についてはプロジェクトページ内における特商法上の表記欄をご確認下さい。
                            </p>
                            <p className="text-lg">
                                なお、リターンに関するプロジェクトオーナーへの質問等は、各プロジェクトページの「メッセージで意見や質問を送る」をクリックする方法にてお問い合わせください。
                            </p>
                            <p className="text-lg font-bold font-semibold">代金の支払い時期</p>
                            <div className="text-lg text-start">
                                <p>各プロジェクトが募集期間内に成立した時点で、支援金の決済が行われます。コンビニ払いは、コンビニエンスストアで所定の方法により支払いが完了した時点で、決済が行われます。銀行振込(ペイジー払い)は、ATMまたはネットバンキングにて所定の方法により支払いが完了した時点で、決済が行われます。au PAY (auかんたん決済)、ソフトバンクまとめて支払い・ワイモバイルまとめて支払い、d払い、PayPal、FamiPay、PayPay、楽天ペイ、au PAYは、各決済画面により支払いが完了した時点で決済が行われます。</p>
                            </div>
                            <p className="text-lg font-bold font-semibold">支払い方法</p>
                            <div className="text-lg text-start">
                                <p>クレジットカード払い (Visa/Mastercard/JCB/Diners Club/American Express) / コンビニ払い(全国の主要コンビニエンスストア) /銀行振込(銀行ATM・ネットバンキング) /au PAY (auかんたん決済) /ソフトバンクまとめて支払い・ワイモバイルまとめて支払い/d払い/PayPal/FamiPay/PayPay/楽天ペイ/au PAY/Apple Pay.</p>
                            </div>
                            <p className="text-lg font-bold font-semibold">商品引渡しまたは役務提供の時期</p>
                            <div className="text-lg text-start">
                                <p>各プロジェクトが募集期間内に成立した場合のみ、支援金の決済が行われ、約定されたリターンを得る権利が発生します。なお、リターン毎の発送 (履行) 時期は各プロジェクトの記載・連絡に準じます。諸般の事情により遅延・遅配が生じる場合は、プロジェクトオーナーより記載・連絡されるものとします。</p>
                            </div>
                            <p className="text-lg font-bold font-semibold">返金・キャンセル</p>
                            <div className="text-lg text-start">
                                <p>法令により認められる場合、およびサービスごとの細則において定める場合を除き、支援のキャンセルによる返金・返品はできません。</p>
                            </div>
                            <p className="text-lg font-bold font-semibold">送料</p>
                            <div className="text-lg text-start">
                                <p>送料は発生しない、または商品価格に含まれます。ただし、海外への発送は別途送料が発生する場合がありますので事前にプロジェクトオーナーまでお問い合わせください。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommercialTranPage;
