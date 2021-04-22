import * as React from 'react'

import { RARITY_COLOR, RARITY_COLOR_LIGHT } from 'modules/item/types'
import { getThumbnailURL } from 'modules/item/utils'
import ItemBadge from 'components/ItemBadge'
import { Props } from './ItemImage.types'
import './ItemImage.css'

export default class ItemImage extends React.PureComponent<Props> {
  static defaultProps = {
    hasBadge: false
  }

  render() {
    const { item, src, hasBadge, badgeSize } = this.props

    const style = item.rarity
      ? { backgroundImage: `radial-gradient(${RARITY_COLOR_LIGHT[item.rarity]}, ${RARITY_COLOR[item.rarity]})` }
      : { backgroundColor: 'var(--secondary)' }

    return (
      <div className="ItemImage is-image image-wrapper" style={style}>
        <img className="image" src={src || getThumbnailURL(item)} alt={item.name} />
        {hasBadge ? <ItemBadge item={item} size={badgeSize}></ItemBadge> : null}
      </div>
    )
  }
}
