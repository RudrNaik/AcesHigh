import {resolveTag} from "./tagResolver"

interface TagDisplayProps {
  allTags: string[];
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  moduleId: string;
}

function TagDisplay({
  allTags,
  activeTag,
  setActiveTag,
  moduleId,
}: TagDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tagId, index) => {
        const tag = resolveTag(tagId);
        if (!tag) return null;

        const isActive = activeTag === tag.id;

        return (
          <div
            key={`${moduleId}-${tag.id}-${index}`}
            onMouseEnter={() => setActiveTag(tag.id)}
            onMouseLeave={() => setActiveTag(null)}
            onClick={() => setActiveTag(isActive ? null : tag.id)}
            className=" relative text-xs px-2 py-1 border border-cyan-100/90 text-cyan-100 cursor-pointer transition hover:bg-cyan-100/10 "
          >
            {tag.name}

            {isActive && (
              <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-black/95border border-cyan-100 p-3 text-xs text-cyan-100 whitespace-pre-line">
                {tag.desc}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TagDisplay