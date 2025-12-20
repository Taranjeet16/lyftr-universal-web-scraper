import { Section } from '@/types/scrape';
import { SectionItem } from './SectionItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface SectionAccordionProps {
  sections: Section[];
}

export function SectionAccordion({ sections }: SectionAccordionProps) {
  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sections found in the scraped content.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section, index) => (
        <AccordionItem key={index} value={`section-${index}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <span className="font-medium">{section.label || `Section ${index + 1}`}</span>
              <Badge variant="secondary" className="text-xs">
                {section.type}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionItem section={section} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
