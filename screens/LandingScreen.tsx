import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark font-display text-white overflow-hidden">
      <div className="flex-grow flex flex-col">
        {/* Header Image Area */}
        <div className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#191022] via-transparent to-[#191022] opacity-80 z-10 pointer-events-none"></div>
          <div 
            className="bg-cover bg-center flex flex-col justify-end min-h-[45vh] relative"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRIuHH4e-NDHuTXF43ba8GGV7IsdCg_4MKzgo3bqqnYmzefao4JcxIfoDiYEjhYa9artxq_hnXQATrBszGSq8Roda9Zr6hTH9gt8FI4FJNgC5lU2H20AptKrqpQIGGOyM1MiB3DaPDxJd6bkhpRQF5Keswp6bz8wEEISUArLpd7EW4Aft3tnw1mxtICV4dZcnn0SMuc3qNlrkuusxPbbnHRh0ICZHoszbpjfycdaMROI7fUEiJ2ip7z6wHb_5Wjk5_ez8rk-zvqFQ")'
            }}
          >
            <div className="flex p-8 z-20 pb-12 bg-gradient-to-t from-[#191022] to-transparent">
              <h1 className="text-white tracking-tight text-5xl font-bold leading-tight">
                The TCG Forge
              </h1>
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="w-full px-4 -mt-8 z-20 relative">
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 snap-x snap-mandatory">
            
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-4">
              <div 
                className="w-full aspect-[16/9] bg-cover bg-center rounded-xl"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAputvhZniIOzoykAQpWhspQUthUMQio-HGfarpVtOrrM-APyzaQwxazrstVKaZ5nR5zu2WJzaV3UM6wZ8ECftNP-xPPcrFn-9hpHmhewOSJ0-_X-x3O02wz5x45H4ptBF6ISmn2HcZY_GSuEfUdrRCYRZip1oMfoOCQqmeRLZEpo5ZRdGrHJ8aUfx5BOAng2PIbYhO1-BXbm2Ya4IBy7KvlwvMn2iWhOKRNDZnIElYyWL1q4Ef2PdHqQwJRUTB45nuDux0eI0lTgQ")' }}
              />
              <div>
                <h3 className="text-xl font-bold mb-1">Design Your TCG Packs</h3>
                <p className="text-gray-400 text-sm">Craft legendary cards and define your universe.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-4">
              <div 
                className="w-full aspect-[16/9] bg-cover bg-center rounded-xl"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDa59233MfXUT-63KY5Oz9uRpmxKs8lKYwcXVhg3qLDKtezYeq_u4KRUHc3filhzdWbUctDtGEehQY3UNgqanXcO8aObJjhVV3DCsAf3mybSyhFbVQmTIlyx73hralAIbtpXBDewu9JPQxggh46bmhRtuMZ2Gg_vmHnV0Hmmughdb7kXg4YVqSBxjq7VLUEFnJycysisEs9PzermiPT_VXk1uHetqZAafhHaBYa-9pOr8N-qsFu6YEOSzsyUvlUIrcnJckXLSYG_r4")' }}
              />
              <div>
                <h3 className="text-xl font-bold mb-1">Craft Legendary Cards</h3>
                <p className="text-gray-400 text-sm">Bring your most epic creations to life with AI.</p>
              </div>
            </div>

             {/* Card 3 */}
             <div className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-4">
              <div 
                className="w-full aspect-[16/9] bg-cover bg-center rounded-xl"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFtqcS9gvVDpAibXnYghNlgMpsk9ppl9h_p-cT9qxdFmbk3Zme6vg1XB6Y3l-64Q94vIly31_80zFNm-yyuit0YFEepYlLy6uzwwJjOZInff9ZMyNEDGFjul0oXWwH0teCQTN8AQpq2K0Gkz7FyVQ4Xo13xRdWqy8nh1uI0bumoJ5NF7CJAs65jYZZpTfAcivqnmmjGtik_E4wdji9qVn9bf2jsOZNKt3Ue4Cm9tkq2wF9-VSBj-HF-lbnfq4rP6AxUX5rbfTDaQg")' }}
              />
              <div>
                <h3 className="text-xl font-bold mb-1">Define Generation Rules</h3>
                <p className="text-gray-400 text-sm">Set weighted attributes for unique pack openings.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
          <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 pb-8 bg-[#191022]">
        <button 
          onClick={() => navigate('/projects')}
          className="w-full bg-primary hover:bg-primary-dark transition-all active:scale-[0.98] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          Begin Your Journey
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <p className="text-center text-gray-500 text-sm mt-4 underline cursor-pointer">
          Already have an account? Sign In
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
