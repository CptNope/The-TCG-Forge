/**
 * Card Preview Component
 * Displays a card with stats overlay when no artwork is available
 */

import React from 'react';
import { Card } from '../../types';
import { generateCardPlaceholder, getRarityColor, AvatarStyle } from '../utils/placeholderImages';

interface CardPreviewProps {
  card: Partial<Card>;
  avatarStyle?: AvatarStyle;
  className?: string;
  showStats?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  card, 
  avatarStyle = 'identicon',
  className = '',
  showStats = true 
}) => {
  const hasArtwork = card.artwork && card.artwork.length > 0;
  
  // Generate placeholder if no artwork
  const placeholder = !hasArtwork ? generateCardPlaceholder({
    name: card.name || 'Unnamed Card',
    type: card.type,
    rarity: card.rarity,
    cost: card.cost,
    power: card.power,
    health: card.health,
    style: avatarStyle as AvatarStyle,
  }) : null;

  const backgroundStyle = hasArtwork
    ? { backgroundImage: `url("${card.artwork}")` }
    : {
        background: placeholder?.gradient,
      };

  const rarityColor = getRarityColor(card.rarity || 'Common');

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{ aspectRatio: '2.5 / 3.5' }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundStyle}
      />
      
      {/* Placeholder Avatar (if no artwork) */}
      {!hasArtwork && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <img 
            src={placeholder.avatarUrl} 
            alt={card.name}
            className="w-2/3 h-2/3 object-contain"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Stats Overlay */}
      {showStats && (
        <>
          {/* Top Section - Name & Type */}
          <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
              {card.name || 'Card Name'}
            </h3>
            <p className="text-white/90 text-xs font-medium mt-1">
              {card.type || 'Type'}
            </p>
          </div>

          {/* Top Right - Cost */}
          {card.cost !== undefined && (
            <div 
              className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg"
              style={{
                background: `radial-gradient(circle, ${rarityColor}, ${rarityColor}dd)`,
                color: 'white',
                border: '3px solid rgba(255, 255, 255, 0.9)',
              }}
            >
              {card.cost}
            </div>
          )}

          {/* Bottom Section - Stats */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            {/* Power & Health */}
            {(card.power !== undefined || card.health !== undefined) && (
              <div className="flex gap-3 mb-2">
                {card.power !== undefined && (
                  <div className="flex items-center gap-1.5 bg-red-500/90 px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-white text-lg">swords</span>
                    <span className="text-white font-bold">{card.power}</span>
                  </div>
                )}
                {card.health !== undefined && (
                  <div className="flex items-center gap-1.5 bg-green-500/90 px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-white text-lg">favorite</span>
                    <span className="text-white font-bold">{card.health}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rarity Badge */}
            {card.rarity && (
              <div 
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: rarityColor }}
              >
                {card.rarity}
              </div>
            )}

            {/* Ability Text (truncated) */}
            {card.abilityText && (
              <p className="text-white/90 text-xs mt-2 line-clamp-2 leading-tight">
                {card.abilityText}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPreview;
