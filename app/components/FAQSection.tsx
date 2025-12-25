import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/Accordion'

const faqs = [
  {
    question: '視聴期限はありますか？',
    answer: '視聴期限はありません。購入後いつでも何度でもご視聴いただけます。',
  },
  {
    question: '動画はどのデバイスで？',
    answer:
      'スマートフォン、タブレット、パソコンなど、インターネットに接続できるデバイスでご視聴いただけます。',
  },
  {
    question: 'サブスクリプションの内容は？',
    answer: '月額プランでは全ての動画コンテンツが見放題となります。',
  },
  {
    question: '購入後のキャンセルは？',
    answer: 'デジタルコンテンツのため、購入後のキャンセルは承っておりません。',
  },
  {
    question: '支払方法は？',
    answer: 'クレジットカード、デビットカード、PayPalでのお支払いが可能です。',
  },
]

const FAQSection = () => {
  return (
    <section className="bg-[#FF0066] py-12 px-4 md:py-16">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-3">よくある質問</h2>
        <p className="text-center text-white/90 text-sm md:text-base mb-8 px-2 font-semibold">
          動画視聴に関する疑問点を解消するための情報を提供します。
        </p>
        <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-full px-5 md:px-6 border-0 text-black"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4 md:py-5 text-sm md:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 md:pb-5 text-sm md:text-base px-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQSection
