import { PhotoWall } from './PhotoWall'
import './PhotoWallTest.css'

// 模拟不同数量的照片数组
const createMockPhotos = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => 
    `https://picsum.photos/400/400?random=${i + 100}`
  )
}

export function PhotoWallTest() {
  const testCases = [
    { count: 0, label: '0张 - 空状态', desc: '引导用户添加第一张照片' },
    { count: 1, label: '1张 - Hero', desc: '英雄位，16:9宽屏，情感聚焦' },
    { count: 2, label: '2张 - Diptych', desc: '双生位，50%对分，对比感' },
    { count: 3, label: '3张 - Focus Grid', desc: '经典重心，左大右小，最耐看' },
    { count: 4, label: '4张 - Quad', desc: '平衡宫格，2×2均等分布' },
    { count: 5, label: '5张 - Mosaic B', desc: '错位拼接，左特大+右2×2' },
    { count: 9, label: '9张 - Grid', desc: '瀑布流，3列宫格，规律展示' },
  ]

  return (
    <div className="testContainer">
      <h1 className="testTitle">📸 PhotoWall 动态布局展示</h1>
      <p className="testSubtitle">根据照片数量自动切换最优排版</p>

      {testCases.map(({ count, label, desc }) => (
        <div key={count} className="testCase">
          <div className="testCaseHeader">
            <span className="testCaseLabel">{label}</span>
            <span className="testCaseDesc">{desc}</span>
          </div>
          <div className="testCaseContent">
            <PhotoWall
              photos={createMockPhotos(count)}
              onPhotoClick={(idx) => console.log(`${label} - 点击照片 ${idx}`)}
              onAddPhoto={() => console.log(`${label} - 添加照片`)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
