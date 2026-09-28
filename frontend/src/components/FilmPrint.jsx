import './FilmPrint.css';

/**
 * FilmPrint Component
 * Renders a vintage photographic loose print.
 * Easy 1-line image swap: pass `imageUrl` to replace the CSS gradient canvas with a real photo.
 */
const FilmPrint = ({
  frameNumber = 'EXP 01',
  category = 'Portrait',
  title = 'Untitled Study',
  description = '',
  aspectRatio = 'portrait', // 'portrait' (4:5), 'landscape' (3:2), 'square' (1:1)
  placeholderClass = 'placeholder-portrait-1',
  tiltClass = '', // 'tilt-left', 'tilt-right', 'tilt-slight-left', 'tilt-slight-right'
  imageUrl = '',
  shutter,
  aperture,
  iso,
  year = '2026',
  className = ''
}) => {
  return (
    <div className={`film-print ${tiltClass} ${className}`}>
      {/* Photo Frame Canvas */}
      <div
        className={`photo-canvas aspect-${aspectRatio} ${!imageUrl ? placeholderClass : ''}`}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
      >
        {/* Frame metadata stamp */}
        <div className="film-frame-stamp">
          {frameNumber} • {category}
        </div>

        {/* Vintage title badge inside placeholder */}
        {!imageUrl && (
          <div className="photo-badge">
            <span>{title}</span>
          </div>
        )}
      </div>

      {/* Typewriter Print Caption Footer */}
      <div className="film-caption">
        <span className="frame-num">{frameNumber}</span>
        <span className="frame-title">{title}</span>
        <span className="frame-cat">{category}</span>
      </div>

      {/* Technical Shutter / Aperture details if provided */}
      {(shutter || aperture || iso) && (
        <div className="film-technical-meta">
          <span>{shutter}</span>
          <span>{aperture}</span>
          <span>{iso}</span>
          <span>{year}</span>
        </div>
      )}
    </div>
  );
};

export default FilmPrint;
