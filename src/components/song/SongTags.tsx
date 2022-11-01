import React from 'react';

import { SongMetadata } from '../../types';

interface SongTagProps {
  attributes: SongMetadata['attributes'];
  tagsExpanded?: boolean;
}

export const SongTags: React.FC<SongTagProps> = ({ attributes, tagsExpanded }) => {
  const allowedTraits = ['Mood', 'Genre'];
  // For each trait, collect all the attributes
  type Tags = { key: string; value: string }[];

  const tagItems = allowedTraits.reduce((tags: Tags, currTrait) => {
    const _allAttributes = attributes
      ?.filter((attribute) => attribute.trait_type === currTrait)
      .map((attr) => attr.value);

    if (_allAttributes.length > 0) {
      tags.push({
        key: `${currTrait}${_allAttributes.length > 1 ? 's' : ''}`,
        value: `${_allAttributes.join(', ')}`,
      });
    }

    return tags;
  }, []);

  const renderTags = (tags: Tags) => {
    const displayMax = 4;
    if (!tagsExpanded) tags = tags.slice(0, displayMax);
    return tags.map((tagContent, index) => {
      return (
        <span key={index} className={'chips mr-2'}>
          {tagContent.key}: <span className={'font-semibold'}>{tagContent.value}</span>
        </span>
      );
    });
  };

  return <>{renderTags(tagItems)}</>;
};
