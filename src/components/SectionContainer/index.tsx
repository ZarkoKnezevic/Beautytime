import { storyblokEditable } from '@storyblok/react/rsc';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import type { StoryblokBlok } from '@/types';

/**
 * Shared section wrapper: `.wrap` horizontal container + vertical rhythm and
 * optional background surface, aligned to the prototype's section spacing.
 */
const sectionVariants = cva('wrap', {
  variants: {
    paddingY: {
      none: 'py-0',
      base: 'py-20',
      large: 'py-[140px]',
    },
    background: {
      none: '',
      sand: 'bg-sand',
      ivory: 'bg-ivory',
      surface: 'bg-surface',
    },
    borderTop: {
      true: 'border-t border-line',
      false: '',
    },
  },
  defaultVariants: {
    paddingY: 'base',
    background: 'none',
    borderTop: false,
  },
});

type SectionContainerProps = VariantProps<typeof sectionVariants> & {
  children: React.ReactNode;
  blok?: StoryblokBlok;
  className?: string;
  as?: 'section' | 'div' | 'header' | 'footer';
};

export default function SectionContainer({
  children,
  blok,
  className,
  as: Tag = 'section',
  paddingY,
  background,
  borderTop,
}: SectionContainerProps) {
  const editable = blok ? storyblokEditable(blok) : {};
  return (
    <Tag
      {...editable}
      className={cn(sectionVariants({ paddingY, background, borderTop }), className)}
    >
      {children}
    </Tag>
  );
}
