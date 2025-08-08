import React, { useState, useEffect, useRef } from 'react';
import { Play, Users, Trophy, Timer, Shuffle, Music, Star, Award, Volume2, VolumeX } from 'lucide-react';

const KaraokeGameShow = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [teams, setTeams] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [gameData, setGameData] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContext = useRef(null);
  const currentAudio = useRef(null);
  
  // Move game state to parent level to prevent reset on team updates
  const [gameState, setGameState] = useState({
    currentRound: 0,
    showAnswer: false,
    gameKey: Date.now()
  });

  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Sound effect functions
  const playSound = (frequency, duration = 200, type = 'sine') => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
  };

  const playCorrectSound = () => {
    playSound(523.25, 100); // C5
    setTimeout(() => playSound(659.25, 100), 100); // E5
    setTimeout(() => playSound(783.99, 200), 200); // G5
  };

  const playWrongSound = () => {
    playSound(196, 400, 'sawtooth'); // G3 with harsh tone
  };

  const playButtonSound = () => {
    playSound(440, 100); // A4
  };

  const playTimerSound = () => {
    playSound(880, 100); // A5
    setTimeout(() => playSound(880, 100), 100);
    setTimeout(() => playSound(880, 100), 200);
  };

  const playGameStartSound = () => {
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, index) => {
      setTimeout(() => playSound(note, 150), index * 100);
    });
  };

  const playSongClip = (audioUrl) => {
    if (!audioUrl) {
      alert("No audio file added for this song yet! Replace the empty audioUrl with your song file URL.");
      return;
    }
    
    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
    
    // Create new audio element
    currentAudio.current = new Audio(audioUrl);
    currentAudio.current.play();
    
    // Stop after 15 seconds
    setTimeout(() => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }
    }, 15000);
  };

  // Sample data for games
  const emojiSongs = [
    { emoji: "🌈💔", answer: "Somewhere Over The Rainbow", artist: "Judy Garland" },
    { emoji: "🔥💍", answer: "Ring of Fire", artist: "Johnny Cash" },
    { emoji: "🌙🚶‍♂️", answer: "Blue Moon", artist: "Frank Sinatra" },
    { emoji: "⚡👦", answer: "Thunderstruck", artist: "AC/DC" },
    { emoji: "💃🕺", answer: "Dancing Queen", artist: "ABBA" },
    { emoji: "🌟👁️", answer: "Starry Starry Night", artist: "Don McLean" },
    { emoji: "🚗🛣️", answer: "Life is a Highway", artist: "Tom Cochrane" },
    { emoji: "🌊🏄‍♂️", answer: "Surfin' USA", artist: "Beach Boys" },
    { emoji: "❄️👸", answer: "Let It Go", artist: "Frozen Soundtrack" },
    { emoji: "🕺💫", answer: "Stayin' Alive", artist: "Bee Gees" },
    { emoji: "🌹💕", answer: "Every Rose Has Its Thorn", artist: "Poison" },
    { emoji: "🎸🔥", answer: "We Will Rock You", artist: "Queen" }
  ];

  const nameThatTuneSongs = [
    { 
      title: "Bohemian Rhapsody", 
      artist: "Queen", 
      hint: "Rock opera masterpiece",
      audioUrl: "https://www.soundjay.com/misc/sounds/beep-07a.wav" // Placeholder - replace with actual song clips
    },
    { 
      title: "Sweet Caroline", 
      artist: "Neil Diamond", 
      hint: "Crowd favorite sing-along",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Don't Stop Believin'", 
      artist: "Journey", 
      hint: "Small town girl...",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "I Will Survive", 
      artist: "Gloria Gaynor", 
      hint: "Disco anthem of empowerment",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Livin' on a Prayer", 
      artist: "Bon Jovi", 
      hint: "Tommy and Gina's story",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Mr. Brightside", 
      artist: "The Killers", 
      hint: "2000s indie rock hit",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Wonderwall", 
      artist: "Oasis", 
      hint: "Britpop classic",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Love Story", 
      artist: "Taylor Swift", 
      hint: "Romeo and Juliet inspired",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Shake It Off", 
      artist: "Taylor Swift", 
      hint: "Haters gonna hate...",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Uptown Funk", 
      artist: "Mark Ronson ft. Bruno Mars", 
      hint: "Saturday night fever",
      audioUrl: "" // Add your song URL here
    }
  ];

  const genres = ['Country', 'Opera', 'Rap/Hip-Hop', 'Heavy Metal', 'Jazz', 'Reggae', 'Folk', 'Electronic'];
  
  const crossGenreSongs = [
    { title: "Baby One More Time", originalGenre: "Pop" },
    { title: "Bohemian Rhapsody", originalGenre: "Rock" },
    { title: "Sweet Caroline", originalGenre: "Pop Rock" },
    { title: "I Will Survive", originalGenre: "Disco" },
    { title: "Don't Stop Believin'", originalGenre: "Rock" },
    { title: "My Girl", originalGenre: "Soul" },
    { title: "Wonderwall", originalGenre: "Britpop" },
    { title: "Love Story", originalGenre: "Country Pop" }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const addTeam = (teamName) => {
    if (teamName && !teams.find(t => t.name === teamName)) {
      setTeams([...teams, { name: teamName, score: 0, id: Date.now() }]);
    }
  };

  const updateScore = (teamId, points) => {
    setTeams(prevTeams => prevTeams.map(team => 
      team.id === teamId ? { ...team, score: team.score + points } : team
    ));
    if (points > 0) {
      playCorrectSound();
    } else if (points < 0) {
      playWrongSound();
    } else {
      playButtonSound();
    }
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsTimerRunning(true);
    playTimerSound();
  };

  const generateRandomTeams = () => {
    const shuffled = [...teams].sort(() => 0.5 - Math.random());
    const teamCount = Math.min(shuffled.length, 4);
    setSelectedTeams(shuffled.slice(0, teamCount));
  };

  const TeamRegistration = () => {
    const [teamName, setTeamName] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              🎤 KARAOKE GAME SHOW 🎤
            </h1>
            <p className="text-xl text-white/90">Register your teams and get ready to rock!</p>
            
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="mt-4 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
            >
              {soundEnabled ? <Volume2 className="inline mr-2" /> : <VolumeX className="inline mr-2" />}
              Sound {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-6">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Team Registration</h2>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && teamName && (addTeam(teamName), setTeamName(''))}
              />
              <button
                onClick={() => teamName && (addTeam(teamName), setTeamName(''), playButtonSound())}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Add Team
              </button>
            </div>

            {teams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-xl flex justify-between items-center">
                    <span className="font-bold text-lg">{team.name}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Score: {team.score}</span>
                  </div>
                ))}
              </div>
            )}

            {teams.length >= 2 && (
              <div className="text-center">
                <button
                  onClick={() => {setCurrentScreen('gameSelect'); playGameStartSound();}}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="inline mr-2" />
                  START GAMES!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GameSelection = () => {
    const games = [
      { id: 'nameThatTune', title: 'Name That Tune', icon: '🎵', description: 'Guess the song from a short clip!' },
      { id: 'emojiSongs', title: 'Emoji Songs', icon: '😄', description: 'Decode songs from emoji clues!' },
      { id: 'duetRoulette', title: 'Duet Roulette', icon: '🎭', description: 'Random duet partnerships!' },
      { id: 'genreSwitch', title: 'Genre Switch', icon: '🎸', description: 'Sing songs in different genres!' },
      { id: 'mysterySinger', title: 'Mystery Singer', icon: '❓', description: 'Guess the team member singing!' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">Choose Your Game!</h1>
            <button
              onClick={() => setCurrentScreen('leaderboard')}
              className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <Trophy className="inline mr-2" />
              View Leaderboard
            </button>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.map(game => (
              <div
                key={game.id}
                onClick={() => {setCurrentGame(game.id); setCurrentScreen('game'); playButtonSound();}}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h3>
                  <p className="text-gray-600">{game.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentScreen('teams')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              Back to Teams
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Leaderboard = () => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🏆 LEADERBOARD 🏆</h1>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            {sortedTeams.map((team, index) => (
              <div
                key={team.id}
                className={`flex items-center justify-between p-6 rounded-2xl mb-4 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-300 to-orange-400' :
                  'bg-gradient-to-r from-blue-200 to-blue-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-3xl font-bold mr-4">#{index + 1}</span>
                  {index === 0 && <Trophy className="text-yellow-600 mr-2" size={32} />}
                  {index === 1 && <Award className="text-gray-600 mr-2" size={28} />}
                  {index === 2 && <Star className="text-orange-600 mr-2" size={24} />}
                  <span className="text-2xl font-bold">{team.name}</span>
                </div>
                <span className="text-3xl font-bold">{team.score}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentScreen('gameSelect')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GameScreen = () => {
    const renderGame = () => {
      switch(currentGame) {
        case 'emojiSongs':
          const currentSong = emojiSongs[gameState.currentRound % emojiSongs.length];
          return (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Decode This Song!</h2>
              <div className="text-8xl mb-8">{currentSong.emoji}</div>
              
              {gameState.showAnswer ? (
                <div className="bg-white/20 p-6 rounded-2xl mb-6">
                  <h3 className="text-3xl font-bold">{currentSong.answer}</h3>
                  <p className="text-xl text-white/80">by {currentSong.artist}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <button
                    onClick={() => updateGameState({ showAnswer: true })}
                    className="bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-400 transition-all font-bold text-xl"
                  >
                    Reveal Answer
                  </button>
                </div>
              )}

              {/* Next Emoji Button - only show after answer is revealed */}
              {gameState.showAnswer && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      updateGameState({
                        currentRound: gameState.currentRound + 1,
                        showAnswer: false,
                        gameKey: Date.now()
                      });
                      playButtonSound();
                    }}
                    className="bg-purple-500 text-white px-8 py-4 rounded-xl hover:bg-purple-400 transition-all font-bold text-xl"
                  >
                    Next Emoji 🎵
                  </button>
                </div>
              )}
            </div>
          );

        case 'genreSwitch':
          const currentSongGenre = crossGenreSongs[gameState.currentRound % crossGenreSongs.length];
          const randomGenre = genres[Math.floor(Math.random() * genres.length)];
          return (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Genre Switch Challenge!</h2>
              <div className="bg-white/20 p-8 rounded-2xl mb-6">
                <h3 className="text-3xl font-bold mb-4">Song: "{currentSongGenre.title}"</h3>
                <p className="text-xl mb-4">Original Genre: {currentSongGenre.originalGenre}</p>
                <p className="text-2xl font-bold text-cyan-300 bg-black/30 p-3 rounded-xl">Perform it as: {randomGenre}!</p>
              </div>
            </div>
          );

        case 'duetRoulette':
          if (teams.length >= 2) {
            const shuffledTeams = [...teams].sort(() => 0.5 - Math.random());
            const team1 = shuffledTeams[0];
            const team2 = shuffledTeams[1];
            return (
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-8">Duet Roulette!</h2>
                <div className="bg-white/20 p-8 rounded-2xl">
                  <h3 className="text-2xl mb-4">Today's duet partners:</h3>
                  <div className="flex justify-center items-center gap-8">
                    <div className="bg-purple-500 p-4 rounded-xl">
                      <h4 className="text-xl font-bold">{team1.name}</h4>
                    </div>
                    <div className="text-4xl">🤝</div>
                    <div className="bg-pink-500 p-4 rounded-xl">
                      <h4 className="text-xl font-bold">{team2.name}</h4>
                    </div>
                  </div>
                  <p className="mt-4 text-lg">Pick any song and perform it together!</p>
                </div>
              </div>
            );
          }
          break;

        case 'mysterySinger':
          return (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Mystery Singer!</h2>
              <div className="bg-white/20 p-8 rounded-2xl">
                <p className="text-xl mb-6">One team member sings while others turn around and guess who it is!</p>
                <div className="text-6xl mb-4">🎭</div>
                <button
                  onClick={() => startTimer(30)}
                  className="bg-yellow-500 text-black px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all font-bold text-xl"
                >
                  Start 30 Second Timer
                </button>
              </div>
            </div>
          );

        case 'nameThatTune':
          const currentSongNTT = nameThatTuneSongs[gameState.currentRound % nameThatTuneSongs.length];
          return (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">Name That Tune!</h2>
              <div className="bg-white/20 p-8 rounded-2xl">
                <p className="text-xl mb-4">Listen to the clip and guess the song!</p>
                <div className="text-6xl mb-6">🎵</div>
                
                {!gameState.showAnswer ? (
                  <div>
                    <div className="bg-blue-500/50 p-4 rounded-xl mb-6">
                      <p className="text-lg font-semibold">Hint: {currentSongNTT.hint}</p>
                    </div>
                    <button
                      onClick={() => {
                        startTimer(15);
                        playSongClip(currentSongNTT.audioUrl);
                      }}
                      className="bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-400 transition-all font-bold text-xl mb-4 mr-4"
                    >
                      🎵 Play 15-Second Clip
                    </button>
                    <button
                      onClick={() => updateGameState({ showAnswer: true })}
                      className="bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-400 transition-all font-bold text-xl"
                    >
                      Reveal Answer
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/30 p-6 rounded-2xl">
                    <h3 className="text-3xl font-bold mb-2">"{currentSongNTT.title}"</h3>
                    <p className="text-xl text-white/90">by {currentSongNTT.artist}</p>
                  </div>
                )}
              </div>
            </div>
          );

        default:
          return <div>Game not found</div>;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timer Display */}
          {timer > 0 && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold z-10">
              <Timer className="inline mr-2" />
              {timer}s
            </div>
          )}

          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            {renderGame()}

            {/* Scoring Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full text-2xl font-bold text-center text-gray-800 mb-4">Award Points:</h3>
              {teams.map(team => (
                <div key={team.id} className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white p-4 rounded-xl flex justify-between items-center">
                  <span className="font-bold">{team.name} ({team.score})</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateScore(team.id, 1)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 5)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 10)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateScore(team.id, -1)}
                      className="bg-red-500/50 px-3 py-1 rounded hover:bg-red-500/70 transition-all"
                    >
                      -1
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            {/* Navigation - hide Next Round button for emojiSongs since it has its own */}
            <div className="flex justify-center gap-4 mt-8">
              {currentGame !== 'emojiSongs' && (
                <button
                  onClick={() => {
                    updateGameState({
                      currentRound: gameState.currentRound + 1,
                      showAnswer: false,
                      gameKey: Date.now()
                    });
                    playButtonSound();
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-bold"
                >
                  Next Round
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentScreen('gameSelect');
                  updateGameState({ currentRound: 0, showAnswer: false, gameKey: Date.now() }); // Reset game state when leaving
                  playButtonSound();
                }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-bold"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  switch(currentScreen) {
    case 'teams':
      return <TeamRegistration />;
    case 'gameSelect':
      return <GameSelection />;
    case 'leaderboard':
      return <Leaderboard />;
    case 'game':
      return <GameScreen />;
    default:
      return <TeamRegistration />;
  }
};

export default KaraokeGameShow;