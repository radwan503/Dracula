'use client';

import GameBlog from "../GameBlog/GameBlog";
import GameSection from "../GameSection/GameSection";
import HeroSection from "../HeroSection/HeroSection";
import JoinClansDashboard from "../JoinClansDashboard/JoinClansDashboard";
import NeonContact from "../NeonContact/NeonContact";
import TournamentBracket from "../TournamentBracket/TournamentBracket";
import TournamentHub from "../TournamentHub/TournamentHub";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSection/>
      <GameSection/>
      <TournamentHub/>
      <TournamentBracket/>
      <JoinClansDashboard/>
      <GameBlog/>
      <NeonContact/>
    </div>
  );
};

export default HomePage;