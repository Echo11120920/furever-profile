import { useMemo } from 'react'
import './PhotoWall.css'

export type PhotoLayout = 'hero' | 'diptych' | 'focus' | 'quad' | 'mosaic' | 'grid'

export interface PhotoWallProps {
  photos: string[]
  title?: string
  onPhotoClick?: (index: number) => void
  onAddPhoto?: () => void
}

// 根据照片数量决定布局
function getLayoutType(count: number): PhotoLayout {
  if (count === 0) return 'hero'
  if (count === 1) return 'hero'
  if (count === 2) return 'diptych'
  if (count === 3) return 'focus'
  if (count === 4) return 'quad'
  if (count === 5) return 'mosaic'
  return 'grid'
}

// 空状态组件
function EmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="photoWallEmpty" onClick={onAdd}>
      <div className="emptyIcon">📷</div>
      <div className="emptyTitle">还没有照片</div>
      <div className="emptyHint">点击添加第一张</div>
    </div>
  )
}

// 单张照片单元
function PhotoCell({
  src,
  index,
  className = '',
  onClick,
}: {
  src: string
  index: number
  className?: string
  onClick?: () => void
}) {
  return (
    <div className={`photoCell ${className}`} onClick={onClick}>
      <img src={src} alt={`照片 ${index + 1}`} loading="lazy" />
    </div>
  )
}

export function PhotoWall({ photos, title, onPhotoClick, onAddPhoto }: PhotoWallProps) {
  const layoutType = useMemo(() => getLayoutType(photos.length), [photos.length])

  const handlePhotoClick = (index: number) => {
    onPhotoClick?.(index)
  }

  // 空状态
  if (photos.length === 0) {
    return (
      <section className="photoWallSection">
        {title && <h3 className="photoWallTitle">{title}</h3>}
        <EmptyState onAdd={onAddPhoto} />
      </section>
    )
  }

  return (
    <section className="photoWallSection">
      {title && <h3 className="photoWallTitle">{title}</h3>}

      <div className={`photoWall ${layoutType}`} data-count={photos.length}>
        {/* 1张: Hero */}
        {layoutType === 'hero' && (
          <PhotoCell
            src={photos[0]}
            index={0}
            className="heroCell"
            onClick={() => handlePhotoClick(0)}
          />
        )}

        {/* 2张: Diptych */}
        {layoutType === 'diptych' && (
          <>
            <PhotoCell
              src={photos[0]}
              index={0}
              className="leftCell"
              onClick={() => handlePhotoClick(0)}
            />
            <PhotoCell
              src={photos[1]}
              index={1}
              className="rightCell"
              onClick={() => handlePhotoClick(1)}
            />
          </>
        )}

        {/* 3张: Focus Grid */}
        {layoutType === 'focus' && (
          <>
            <PhotoCell
              src={photos[0]}
              index={0}
              className="bigCell"
              onClick={() => handlePhotoClick(0)}
            />
            <PhotoCell
              src={photos[1]}
              index={1}
              className="smallTop"
              onClick={() => handlePhotoClick(1)}
            />
            <PhotoCell
              src={photos[2]}
              index={2}
              className="smallBottom"
              onClick={() => handlePhotoClick(2)}
            />
          </>
        )}

        {/* 4张: Quad */}
        {layoutType === 'quad' && (
          <>
            {photos.map((src, idx) => (
              <PhotoCell
                key={idx}
                src={src}
                index={idx}
                className={`quadCell quadCell-${idx}`}
                onClick={() => handlePhotoClick(idx)}
              />
            ))}
          </>
        )}

        {/* 5张: Mosaic B */}
        {layoutType === 'mosaic' && (
          <>
            <PhotoCell
              src={photos[0]}
              index={0}
              className="mosaicBig"
              onClick={() => handlePhotoClick(0)}
            />
            <div className="mosaicRight">
              {photos.slice(1).map((src, idx) => (
                <PhotoCell
                  key={idx + 1}
                  src={src}
                  index={idx + 1}
                  className="mosaicSmall"
                  onClick={() => handlePhotoClick(idx + 1)}
                />
              ))}
            </div>
          </>
        )}

        {/* 6+张: Grid */}
        {layoutType === 'grid' && (
          <>
            {photos.map((src, idx) => (
              <PhotoCell
                key={idx}
                src={src}
                index={idx}
                className="gridCell"
                onClick={() => handlePhotoClick(idx)}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
