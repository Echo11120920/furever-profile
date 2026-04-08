import { useMemo, useState } from 'react'
import './App.css'
import { PhotoWall } from './PhotoWall'
import { SNAPS_7D } from './snaps7d'

type RainbowStyle = 'bar' | 'badge' | 'border'
type UIVersion = 'original' | 'glass' | 'elements' | 'colorful' | 'minimal'

type Pet = {
  id: string
  name: string
  avatar: string
  daysInFurever: number
  gender: string
  age: string
  crossedOver: string
  petId: string
  treatCount: number
}

// Figma-local asset URLs (served by Figma desktop MCP on localhost:3845)
const imgChatBg =
  'http://localhost:3845/assets/9277229ced09467d7de15fcbb5a96e75528d6c08.png'
const imgPetAvatar1 =
  'http://localhost:3845/assets/c46cf7430c79331057484e0695c479d700aadf6b.png'
const imgChevronLeft =
  'http://localhost:3845/assets/9121d35dcdac9f60896b9a77a8c35fc57423b829.svg'
const imgGear =
  'http://localhost:3845/assets/c60cfaed1f415cec26cd6e4eff97aa1d5375b02f.svg'
const imgCoin =
  'http://localhost:3845/assets/afe16a6ced379f663c8168eabe181058d377602f.svg'

// Sample pet card data (matching the screenshot content)
const defaultPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Alex',
    avatar: imgPetAvatar1,
    daysInFurever: 3965,
    gender: 'Girl',
    age: '5 years',
    crossedOver: '12/10/2023',
    petId: 'Fur-2002-∞',
    treatCount: 2,
  },
]

function App() {
  const activePet = defaultPets[0]
  const [rainbowStyle, setRainbowStyle] = useState<RainbowStyle>('bar')
  const [uiVersion, setUiVersion] = useState<UIVersion>('original')

  const photoSections = useMemo(() => {
    const byDate = new Map<string, { createdAt: string; imageUrl: string }[]>()
    for (const row of SNAPS_7D) {
      const list = byDate.get(row.date) ?? []
      list.push({ createdAt: row.createdAt, imageUrl: row.imageUrl })
      byDate.set(row.date, list)
    }

    const dates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a))
    for (const date of dates) {
      const list = byDate.get(date)
      if (!list) continue
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }

    // 让 7 天分别触发 PhotoWall 的 7 种布局：0/1/2/3/4/5/9
    const layoutCounts = [0, 1, 2, 3, 4, 5, 9]
    const fallbackPool = dates.flatMap((d) => (byDate.get(d) ?? []).map((x) => x.imageUrl))

    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const toTitle = (date: string, index: number) => {
      if (index === 0) return 'Today'
      if (index === 1) return 'Yesterday'
      const d = new Date(`${date}T00:00:00Z`)
      return formatter.format(d)
    }

    return dates.slice(0, 7).map((date, index) => {
      const list = byDate.get(date) ?? []
      const want = layoutCounts[index] ?? list.length

      const primary = list.map((x) => x.imageUrl)
      const photos =
        want <= primary.length
          ? primary.slice(0, want)
          : primary.concat(fallbackPool).slice(0, want)

      return {
        key: date,
        date,
        title: toTitle(date, index),
        photos,
      }
    })
  }, [])

  const versionLabels: Record<UIVersion, string> = {
    original: '原始版本',
    glass: 'A. 激进玻璃',
    elements: 'B. 新元素',
    colorful: 'C. 鲜明配色',
    minimal: 'D. 简洁现代',
  }

  function getLayoutName(count: number): string {
    if (count === 0) return ' - 空状态'
    if (count === 1) return ' - Hero'
    if (count === 2) return ' - Diptych'
    if (count === 3) return ' - Focus Grid'
    if (count === 4) return ' - Quad'
    if (count === 5) return ' - Mosaic B'
    return ' - Grid'
  }

  return (
    <div className={`demoRoot version-${uiVersion}`}>
      {/* 版本切换器 - 固定在左上角 */}
      <div className="versionSwitcher">
        <div className="versionLabel">UI版本</div>
        <div className="versionButtons">
          {(Object.keys(versionLabels) as UIVersion[]).map((v) => (
            <button
              key={v}
              className={uiVersion === v ? 'versionBtn active' : 'versionBtn'}
              onClick={() => setUiVersion(v)}
            >
              {versionLabels[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="phone">
        <div className="bgImage" aria-hidden="true">
          <img src={imgChatBg} alt="" />
        </div>
        <div className="screen">
          <header className="topBar">
            <button className="iconButton" aria-label="Back">
              <img src={imgChevronLeft} alt="" />
            </button>

            <div className="topRight">
              <button className="iconButton" aria-label="Settings">
                <img src={imgGear} alt="" />
              </button>
              <button className="pillButton" aria-label="Treat balance">
                <img src={imgCoin} alt="" />
                <span>{activePet.treatCount}</span>
              </button>
            </div>
          </header>

          <main className="content">
            <section className="passportSection">
              <div className="demoStylePicker" role="group" aria-label="Rainbow style">
                <button
                  className={rainbowStyle === 'bar' ? 'stylePill active' : 'stylePill'}
                  type="button"
                  onClick={() => setRainbowStyle('bar')}
                >
                  Bar
                </button>
                <button
                  className={rainbowStyle === 'badge' ? 'stylePill active' : 'stylePill'}
                  type="button"
                  onClick={() => setRainbowStyle('badge')}
                >
                  Badge
                </button>
                <button
                  className={rainbowStyle === 'border' ? 'stylePill active' : 'stylePill'}
                  type="button"
                  onClick={() => setRainbowStyle('border')}
                >
                  Border
                </button>
              </div>

              <div className={`passportCard passportCardV2 rainbow-${rainbowStyle} ui-${uiVersion}`}>
                <div className="rainbowBar" aria-hidden="true" />
                <div className="rainbowBadge" aria-hidden="true" />
                
                {/* 卡片顶部装饰条 */}
                <div className="cardTopStripe">
                  <div className="chipIcon">
                    <div className="chipInner">
                      <div className="chipLine h" />
                      <div className="chipLine v" />
                    </div>
                  </div>
                  <div className="cardType">FUREVER ID</div>
                </div>

                <div className="passportHeaderV2">
                  <div className="avatarV2">
                    <img src={activePet.avatar} alt={activePet.name} />
                    <div className="avatarRing" />
                  </div>

                  <div className="petInfoV2">
                    <div className="petNameRow">
                      <div className="petNameV2">{activePet.name}</div>
                      <div className="verifiedBadge" title="Verified">✓</div>
                    </div>
                    <div className="petMetaV2">{activePet.daysInFurever.toLocaleString()} days in Furever world</div>
                    <div className="petStatus">
                      <span className="statusDot" />
                      <span className="statusText">Rainbow Bridge Resident</span>
                    </div>
                  </div>
                </div>

                <div className="passportBodyV2">
                  <div className="infoGrid">
                    <div className="infoItem">
                      <span className="infoLabel">Gender</span>
                      <span className="infoValue">{activePet.gender}</span>
                    </div>
                    <div className="infoItem">
                      <span className="infoLabel">Age</span>
                      <span className="infoValue">{activePet.age}</span>
                    </div>
                    <div className="infoItem">
                      <span className="infoLabel">Crossed over</span>
                      <span className="infoValue">{activePet.crossedOver}</span>
                    </div>
                    <div className="infoItem">
                      <span className="infoLabel">ID</span>
                      <span className="infoValue idValue">{activePet.petId}</span>
                    </div>
                  </div>
                </div>

                {/* 卡片底部 - QR码和签名条 */}
                <div className="cardFooter">
                  <div className="qrCode">
                    <div className="qrPattern">
                      <div className="qrRow"><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot filled" /><div className="qrDot filled" /><div className="qrDot" /></div>
                      <div className="qrRow"><div className="qrDot" /><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot" /><div className="qrDot filled" /></div>
                      <div className="qrRow"><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot" /></div>
                      <div className="qrRow"><div className="qrDot" /><div className="qrDot filled" /><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot filled" /></div>
                      <div className="qrRow"><div className="qrDot filled" /><div className="qrDot" /><div className="qrDot" /><div className="qrDot filled" /><div className="qrDot" /></div>
                    </div>
                  </div>
                  <div className="signatureStrip">
                    <div className="signatureLabel">Guardian</div>
                    <div className="signatureLine">Echo</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="quickCards">
              <button className="quickCard horizontal" type="button">
                <div className="quickIcon">🎁</div>
                <div className="quickContent">
                  <div className="quickNumber">12</div>
                  <div className="quickLabel">Gift box</div>
                </div>
              </button>
              <button className="quickCard horizontal" type="button">
                <div className="quickIcon">📖</div>
                <div className="quickContent">
                  <div className="quickNumber">12</div>
                  <div className="quickLabel">Story book</div>
                </div>
              </button>
            </div>

            {photoSections.map((section) => (
              <div key={section.key} className={`photoWallWrapper ui-${uiVersion}`}>
                <PhotoWall
                  photos={section.photos}
                  title={`${section.title} (${section.photos.length}张${getLayoutName(section.photos.length)})`}
                  onPhotoClick={(idx) => console.log(`点击 ${section.title} 照片:`, idx)}
                  onAddPhoto={() => console.log(`添加 ${section.title} 照片`)}
                />
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
