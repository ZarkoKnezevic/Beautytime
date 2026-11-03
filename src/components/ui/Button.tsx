import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

/**
 * CTA button matching the prototype's `.btn` / `.btn.solid`.
 * Renders an anchor when `href` is set, otherwise a native button.
 */
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      outline: '',
      solid: 'solid',
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant, className, children, ...rest } = props;
  const classes = cn(buttonVariants({ variant }), className);

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

export { buttonVariants };
