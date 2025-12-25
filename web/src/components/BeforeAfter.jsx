import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function BeforeAfter({ originalUrl, enhancedUrl }) {
    if (!originalUrl || !enhancedUrl) return null;

    return (
        <div className="comparison-container">
            <ReactCompareSlider
                itemOne={
                    <ReactCompareSliderImage
                        src={originalUrl}
                        alt="Original"
                        style={{ objectFit: 'contain' }}
                    />
                }
                itemTwo={
                    <ReactCompareSliderImage
                        src={enhancedUrl}
                        alt="Enhanced"
                        style={{ objectFit: 'contain' }}
                    />
                }
                position={50}
                style={{
                    height: '320px',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            />
            <div className="comparison-labels">
                <span>← Original</span>
                <span>Enhanced →</span>
            </div>
        </div>
    );
}
