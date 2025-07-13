import React, { useState, useEffect } from 'react';

interface ImageData {
  id: string;
  author: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?page=5&limit=12')
      .then(response => response.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, []);

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex === 0 ? images.length - 1 : selectedIndex - 1));
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading gallery...</h2>;

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2e9, #fbe7c6)'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#8c3f0d'
      }}>
        Gallery
      </h1>

      {/* Thumbnails */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px'
      }}>
        {images.map((img, index) => (
          <div
            key={img.id}
            style={{
              border: '2px solid #f5d5a3',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(240, 170, 100, 0.3)',
              background: '#fff8f0',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <img
              src={`https://picsum.photos/id/${img.id}/400/300`}
              alt={img.author}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <p style={{
              textAlign: 'center',
              margin: '10px 0',
              fontWeight: '500',
              color: '#b05e27'
            }}>{img.author}</p>
          </div>
        ))}
      </div>

      {/* Large viewer */}
      {selectedIndex !== null && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          <img
            src={`https://picsum.photos/id/${images[selectedIndex].id}/800/600`}
            alt={images[selectedIndex].author}
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(240, 170, 100, 0.5)',
              background: '#fff8f0'
            }}
          />
          <p style={{
            color: '#fdf2e9',
            marginTop: '10px',
            fontWeight: '600'
          }}>{images[selectedIndex].author}</p>
          <div style={{
            marginTop: '15px',
            display: 'flex',
            gap: '20px'
          }}>
            <button onClick={prevImage} style={navButtonStyle}>&lt;</button>
            <button onClick={() => setSelectedIndex(null)} style={navButtonStyle}>Close</button>
            <button onClick={nextImage} style={navButtonStyle}>&gt;</button>
          </div>
        </div>
      )}
    </div>
  );
};

const navButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: '#f5d5a3',
  border: 'none',
  borderRadius: '8px',
  color: '#8c3f0d',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(240, 170, 100, 0.4)',
  transition: 'transform 0.3s'
};

export default Gallery;
