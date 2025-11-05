"use client";
import React, { useState, use, useRef } from 'react';
import Image from 'next/image';
import ProjectCard from '@/app/components/project-card';
import { projects } from "@/app/data/projects";
import Link from 'next/link';


const ProjectDetailPage = ({ params: paramsPromise }: { params: Promise<{ projectId: string }> }) => {
const params = use(paramsPromise);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);



  //scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  //  Find the project by ID from your projects array
  const project = projects.find(
    (p) => p.id.toString() === params.projectId
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>プロジェクトが見つかりませんでした。</p>
      </div>
    );
  }

  // Dummy images for placeholder
  const dummyImages = [
     '/assets/crowdfunding/cf-4.png', '/assets/crowdfunding/cf-3.png', '/assets/crowdfunding/cf-2.png'
  ]

  // Recommended projects
  const recommendedProjects = [
    { id: 1, title: '伝説のバンド・ピンクサワファイヤーが復活 1日だけの復活ライブ', amount: '¥2,000,000', supporters: '22人', daysLeft: '11日', achievementRate: 85, image: '/assets/crowdfunding/cf-1.png' },
    { id: 2, title: 'スピリチャルアイドル 占い師五人が占いだけでアイドルを選抜プロデュースするドキュメント番組', amount: '¥2,000,000', supporters: '22人', daysLeft: '11日', achievementRate: 65, image: '/assets/crowdfunding/cf-2.png' },
    { id: 3, title: '大島テルの怖い話 速りすぐりの怖い実話をここだけで披露 あの恐怖の顔の今は？', amount: '¥2,000,000', supporters: '22人', daysLeft: '11日', achievementRate: 120, image: '/assets/crowdfunding/cf-3.png' },
    { id: 4, title: '大島テルの怖い話 速りすぐりの怖い実話をここだけで披露 あの恐怖の顔の今は？', amount: '¥2,000,000', supporters: '22人', daysLeft: '11日', achievementRate: 95, image: '/assets/crowdfunding/cf-4.png' }
  ];

  // Returns/rewards data
  const returns = [
    {
      title: 'エンドロールお名前掲載',
      price: '5,000円',
      description: '・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ'
    },
    {
      title: 'エンドロールお名前掲載',
      price: '5,000円',
      description: '・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ'
    },
    {
      title: 'エンドロールお名前掲載',
      price: '5,000円',
      description: '・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ'
    }
  ];

    const creators = [
    { id: 1, title:"", image: "/assets/crowdfunding/creator-1.png", text: "このプロジェクトでは、SHOGOのグラミー賞受賞への道のりをドキュメンタリー映像として記録し、多くの人々に感動と勇気を与えたいと考えています。彼の音楽活動の舞台裏や、日々の努力、そして挑戦の軌跡を映像化このプロジェクトでは、" },
    { id: 2, title:"", image: "/assets/crowdfunding/creator-2.png", text: "SHOGOは、幼い頃からバイオリンの美しい旋律に魅了され、幾多の困難を乗り越えながら演奏家としての道を歩んできました。時に厳しい練習に涙し、挫折に打ちひしがれそうになりながらも、彼を突き動かしたのは、音楽を通じて人々の心に寄り添いたいという純粋な願いでした。彼の夢であるグラミー賞受賞は、貧しさや逆境の中で希望を見出そうと懸命に生きる人々に勇気を与えるシンボルとなる" },
    { id: 3, title:"", image: "/assets/crowdfunding/creator-3.png", text: "クラウドファンディングならではの リターンをご用意しています！ ぜひ皆様のご無理のない範囲で 応援お願い致します。" },
  ];

  return (
    <div className="min-h-screen  bg-white text-gray-700 mx-auto  pt-21 ">
      
      <main className='max-w-[1440px] mx-auto'>
        {/* Section 1: Hero Banner */}
        <section className="relative ">
          {/* Desktop Layout */}
          <div className="hidden lg:flex h-[50vh]">
            {/* Left Black Background */}
            <div className="w-[60%] bg-black flex items-center justify-center p-5 ">
              <div className="text-white max-w-3xl md:ml-10">
                <h1 className="xl:text-6xl lg:text-4xl sm:text-3xl  font-bold mb-6">{project.title}</h1>
                <p className="text-lg mb-8 leading-relaxed">{project.description}</p>
                <Link
                  href={`/crowdfunding/${project.id}/support`}
                  className="bg-[#FF0066] hover:bg-red-700 text-white font-bold py-3 px-8 sm:w-1/2 rounded-3xl transition-colors inline-block text-center"
                >
                  プロジェクトを支援する
                </Link>
              </div>
            </div>
            
            {/* Right Image with Gradient Overlay */}
            <div className="w-[60%] relative">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden h-[50vh] mb-10 flex flex-col">
            {/* Top Image */}
            <div className="h-[30vh] relative">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Bottom Black Background */}
            <div className="h-[30vh] bg-black flex items-center justify-center p-6">
              <div className="text-white text-center">
                <h1 className="sm:text-2xl text-xl  font-bold mb-4">{project.title}</h1>
                <p className="sm:text-sm text-xs mb-4 line-clamp-3">{project.description}</p>
                <Link
                  href={`/crowdfunding/${project.id}/support`}
                  className="bg-[#FF0066] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors sm:text-sm text-xs inline-block text-center"
                >
                  プロジェクトを支援する
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Media Gallery & Project Information */}
        <section className="hidden md:block max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
              {/* Media Gallery - Left */}
              <div className='lg:h-full h-[800px]'>
              {/* Main Image Display with Navigation */}
              <div className="relative h-[70%] bg-gray-200 rounded-lg mb-4 flex items-center justify-center"> 
                  {dummyImages && dummyImages.length > 0 ? (
                  <Image
                      src={dummyImages[selectedImage]}
                      alt={`Project image ${selectedImage + 1}`}
                      fill
                      className="object-cover "
                  />
                  ) : (
                  // Placeholder for when there are no images or project.images is empty
                  <div className="text-gray-400 text-6xl">
                      {/* Placeholder icon or text */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                  </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <button 
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : dummyImages.length - 1)}
                  className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black/50 text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                  >
                  &lt;
                  </button>
                  <button 
                  onClick={() => setSelectedImage(prev => prev < dummyImages.length - 1 ? prev + 1 : 0)}
                  className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black/50 text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  aria-label="Next image"
                  >
                  &gt;
                  </button>
              </div>
              
              {/* Thumbnail Slider */}
              <div className=" flex space-x-2 overflow-x-auto w-full ">
                  {dummyImages.map((image, index) => (
                  <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-1/3 h-36.5 cursor-pointer ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                  >
                      <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={100} // Adjust width as needed for your design
                      height={100} // Adjust height as needed for your design
                      className="w-full h-full object-cover "
                      />
                  </button>
                  ))}
              </div>
              </div>

              {/* Project Information - Right */}
              <div className="space-y-6 lg:ml-4">
              <div>
                  <h2 className="text-md text-black font-bold mb-4">現在の支援総額</h2>
                  <p className="text-7xl font-bold text-gray-900">{project.amount}</p>
              </div>

              {/* Progress Bar */}
              <div>
              <div className="w-full border-1 border-[#D9D9D9] rounded-full h-10 mb-2 overflow-hidden ">
                  <div 
                  className="flex  items-center bg-gradient-to-r from-[#FF0101] to-[#FFA101] h-10 rounded-full" 
                  style={{ width: `${project.achievementRate}%` }}
                  >
                  <p className="text-xl text-white font-bold ml-4 md:ml-6 whitespace-nowrap ">
                      {project.achievementRate}%
                  </p>
                  </div>
              </div>
              
              <p className="text-3xl text-black font-bold">目標金額：{project.amount}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-rows-2 gap-8">
                  <div>
                  <p className="text-md text-black font-bold">支援者数</p>
                  <p className="text-6xl text-black font-bold">{project.supporters}</p>
                  </div>
                  <div>
                  <p className="text-md text-black font-bold">募集終了までの残り</p>
                  <p className="text-6xl text-black font-bold">{project.daysLeft}</p>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                  <Link
                    href={`/crowdfunding/${project.id}/support`}
                    className="flex-1 cursor-pointer bg-[#EB4040] hover:bg-red-700 text-white text-xl font-bold py-3 px-6 rounded-3xl transition-colors text-center"
                  >
                    プロジェクトを支援する
                  </Link>
                  <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="w-12 h-12 cursor-pointer flex items-center justify-center  rounded-3xl hover:bg-gray-50/60 transition-colors"
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                  <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-25 w-25 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  </button>
              </div>
              </div>
          </div>
        </section>

        {/* Section 3: Project Recommendations */}
        <section className="hidden md:block bg-[#ECEBD9] py-12">
          <div className="max-w-[1320px] mx-auto px-2 sm:px-6">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              このプロジェクトを見た人はこちらもチェックしています
            </h2>

            <div className="relative">
              <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar"
              >
                {/* Repeat projects multiple times to simulate infinity */}
                {Array.from({ length: 20 }).map((_, loopIndex) =>
                  projects.map((project) => (
                    <div
                      key={`${project.id}-${loopIndex}`}
                      className="flex-shrink-0 w-75"
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={scrollLeft}
                className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -ml-5"
                aria-label="Scroll left"
              >
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5996 2.19629L2.88761 9.94029L11.5996 17.6843"
                    stroke="white"
                    strokeWidth="2.904"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                onClick={scrollRight}
                className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -mr-5"
                aria-label="Scroll right"
              >
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.40039 2.19629L11.1124 9.94029L2.40039 17.6843"
                    stroke="white"
                    strokeWidth="2.904"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>



        {/* Section 4: About the Creator & Rewards */}
        <section className="hidden md:block py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left Column: About the Creator (60% width on desktop) */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* First Content Block */}
                {creators.map((creator) => (
                <div key={creator.id} className="bg-white rounded-lg pb-10">
                  <div className="flex flex-col md:flex-column gap-6">
                    <div className="md:w-full">
                      <h3 className="text-2xl font-bold mb-4 text-[#FF0066]">プロジェクト実行者について</h3>
                      <div className="relative h-[40vh] bg-gray-200 rounded-lg overflow-hidden">
                        <Image src={creator.image} alt="クリエイターとの対話" fill className="h-[70%] object-cover" />
                      </div>
                    </div>
                    <div className="md:w-full">
                      <p className="text-black leading-relaxed">{creator.text}</p>
                    </div>
                  </div>
                </div>
              ))}
                

                
            </div>

            {/* Right Column: Rewards List (40% width on desktop) */}
            <div className="space-y-6 lg:col-span-2">
                
                {/* Reward Card  */}
                {returns.map((reward, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="relative h-52 w-full rounded-md mb-4 overflow-hidden">
                      <Image src={`/assets/crowdfunding/rewards-${index + 1}.png`} alt={reward.title} fill className="object-cover" />
                    </div>
                    <div className="p-6 pt-0">
                      <h3 className="text-xl font-bold text-black mb-2">{reward.title}</h3>
                      <p className="text-3xl font-bold text-black mb-4">{reward.price}</p>
                      <p className="text-sm text-black whitespace-pre-line mb-6">{reward.description}</p>
                      <button className="w-full bg-[#FF0066] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-3xl transition-colors">
                        このリターンを選択する
                      </button>
                    </div>
                  </div>
                ))}

                
                

                
            </div>
            </div>
        </div>
        </section>

        {/* Section 5 (for mobile screens only)  */}
        <section className='md:hidden '>
          {/* Project Grid Section */}
          <h2 className="text-2xl font-bold text-black mb-8 text-center px-4">
              「映画」で検索した結果1944件のプロジェクトが見つかりました。
            </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-lg mx-auto gap-4 md:gap-y-8 mb-12  px-4  ">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>


        {/* Section 6: only for mobile screens  */}
        <section>
        {/* Pagination */}
        <div className="flex md:hidden justify-center space-x-0 ">
          <button className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5 mb-10" aria-label="Previous page">
            <svg width="10" height="10" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5307 19.6687L6.66191 12.7999H21.9995V9.59995H6.66191L13.5307 2.73115L11.2683 0.46875L0.537109 11.1999L11.2683 21.9312L13.5307 19.6687Z" fill="black"/>
            </svg>

          </button>
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map(page => (
            <button 
              key={page} 
              className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${page === 1 
                ? 'bg-red-600 text-white border border-[#FF0066]' 
                : ' hover:bg-gray-100'}`}
            >
              {page}  
            </button>
          ))}
          
          <button className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5" aria-label="Next page">
            <svg width="10" height="12" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.26861 19.6687L11.531 21.9312L22.2622 11.1999L11.531 0.46875L9.26861 2.73115L16.1374 9.59995H0.799805V12.7999H16.1374L9.26861 19.6687Z" fill="black"/>
            </svg>

          </button>
        </div>
      </section>

      </main>
      
    </div>
  );
};

export default ProjectDetailPage;