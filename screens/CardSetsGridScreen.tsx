import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardSet } from '../types';

const cardSets: CardSet[] = [
  { id: '1', name: 'Chronicles of Aethel', count: '78/100 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMAeVo0THX0WngFxV6NEpfoCAokuzfNjQ6t2l2juVusNW7iTFIcZHyYWokXgCdO51PAgD1GOPK04rt1iLnRelYyf2LztR6yZS1HjFPIDkJvKT14al-f8szxDtEl-We3h9Fq3Hw0rYHnloHnfkJtb7coxrmnYNxKu96ASYVpy2xUTd22MbsJorOd17HYb8B-a4vblezkckZmBinIJK312LPymtVLbTbo_napaOhSZSLj7QPl46-BQZ8QWSGDHoPiHdAfNSjlbka--8' },
  { id: '2', name: 'Voidwalkers', count: '150/150 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaN-0iH685JayAGVX7Vt_FmddMQEYCymILTnhV8JYrYeiTzLAve04yhUz3vBUu-JMncwS8jktHyJ-K5qCSi7D-jt6YfJiCdlWrt8v33YU5fAKZ9xlVe13Hb5JUdXG_SMnYFyOAG9k6uCN2uQE2envMC75Zer97QtIR14esE-btJhtmsBx3OlsalmrKflGUhHKTa9Mlojteo-RUeEbnL6rt8t3uVd_GA_9AyLvzn2bQMpNpGwTODRwElyg73o8u8AaNP7Pxg3lIXkc' },
  { id: '3', name: 'Sunken Treasures', count: '45/120 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoJwmMSQpPM394krZt6GJwNEH0ryyI5g2cLiEfeJiiH-JvHrpCH24Xj50HUwe8Ddbu3CieekGlyySTndfoi5VibF3o9rKDPHC60-GEkOIgoeAdT4oP-EsNf4wlkKJKlTUXvTU0BYxZSZ68FgOpd1-5AD1fd_xPXiuxwPwC6mkye6v78OZ0y9baG-rge4-5grZD6_AFhlMomnzMyE6HZFn20VtY9uv-9VEsrCPOj1-x9a3B0rKVOU1cmVydI6EX8QFORb6tqb8R_4' },
  { id: '4', name: 'Skywardens', count: '99/100 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn_GmftOO1RWQcNeIa0vJ7E2ORIHZ2Ja7zvcqVDToR2gC9eTRYTAA0QgybLHTh_QqV-bDdD6qgVVh--k33ztcWG08ZVVOpnamyKZzZgdSy8TT0yCDcG1t1IIBl_CK-Dggc8NrhOQMJQ2yFkYuSxipO79ww_bITWJVDX-hmNkC-9soRja7FRseumKGU61G_lrYQHFtEJtGpdvddvO0mZGfKAusfrkLfkPRKRAELK21MezRmVxMEdFeG0jYRjJjD9jvYQiH6ebD3LUA' },
  { id: '5', name: 'Iron Empire', count: '200/200 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4CMKOpcTQ09Rj5v2mnsPQ_qBZYX9RC6hYmkv9Bk9u7wgaf5qhtLE6S3tKvuWurFX7I0Okem0MuAiIcjl1dA75Yd2kntB0DTKoXJdsKT1rV7m3SHGrkMigDohACbfFo8zYwZI4FlTGUlm2L_3mNAQSugP0SswPx5veJ1u0FNkKxaDfU0aQXz-sRJUeuHoB3MRzQzFd88o2GeVfp8RfZKl93iUpfn3dEeHeXarMZoirS4_qGopstuH92TkotCK-34lsaE0mGNYKFsU' },
  { id: '6', name: 'Mystic Grove', count: '60/150 Cards', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtBAV5niZo5wUQbpkHfvl3ZImMaz-qgHsBTdsT4R-LD8qyxTLYh0yyouZyh-y7wPv-J-cF0AhbSJo7c5OhMdaJJ1fiJRK8lLPFzeXfbgukVKc6F0_3FwKXrCJAG8ZRLplrUjYyo98ulxzC9d6e0N487yccqtLfXxlq1Arr084c3CdqoRb_WaGr1iPrCW4tIn7eWP81VmELnOkTwS_6D7aWLLDSQ-up40sQORSiZw03sBpj-JVO4-StXBUospD7YqVZWGTmZEt26r4' },
];

const CardSetsGridScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-transparent">
        <div className="flex size-12 shrink-0 items-center justify-start cursor-pointer" onClick={() => navigate('/projects')}>
          <span className="material-symbols-outlined text-zinc-800 dark:text-white text-2xl">widgets</span>
        </div>
        <h1 className="text-zinc-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">My Card Sets</h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center h-12 w-12 text-zinc-800 dark:text-white">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[64px] bg-background-light dark:bg-background-dark z-10">
        <div className="flex border-b border-zinc-200 dark:border-zinc-700/50 px-4 gap-8">
          <button className="flex flex-col items-center justify-center border-b-[3px] border-primary text-zinc-900 dark:text-white pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">All Sets</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-zinc-500 dark:text-zinc-400 pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">Official</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-zinc-500 dark:text-zinc-400 pb-3 pt-4 flex-1">
            <p className="text-sm font-bold">Custom</p>
          </button>
        </div>
      </nav>

      {/* Grid Content */}
      <main className="flex-grow overflow-y-auto pb-32">
        <div className="grid grid-cols-2 gap-4 p-4">
          {cardSets.map((set) => (
            <div key={set.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => navigate('/sets-list')}>
              <div 
                className="w-full aspect-[3/4] bg-center bg-no-repeat bg-cover rounded-xl shadow-md group-hover:shadow-lg transition-all group-active:scale-[0.98]"
                style={{ backgroundImage: `url("${set.image}")` }}
              ></div>
              <div>
                <p className="text-zinc-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{set.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">{set.count}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FABs */}
      <div className="fixed bottom-24 right-4 z-20 flex flex-col items-center gap-4">
        <button 
          onClick={() => navigate('/card-editor')}
          className="flex h-12 w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white dark:bg-zinc-700 px-4 py-3 text-zinc-900 dark:text-white shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">note_add</span>
          <span className="text-sm font-bold">Add New Card</span>
        </button>
        <button 
           onClick={() => navigate('/pack-designer')}
           className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <footer className="flex gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 pb-4 pt-2 fixed bottom-0 w-full z-10">
        <button onClick={() => navigate('/')} className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">home</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Home</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
          <span className="material-symbols-outlined text-2xl filled">inventory</span>
          <p className="text-[10px] font-bold uppercase tracking-wider">Sets</p>
        </button>
        <button onClick={() => navigate('/attributes')} className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">style</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Attrs</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-end gap-1 text-zinc-500 dark:text-zinc-400">
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <p className="text-[10px] font-medium uppercase tracking-wider">Profile</p>
        </button>
      </footer>
    </div>
  );
};

export default CardSetsGridScreen;
