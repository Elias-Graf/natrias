export { TemplateType } from './type';

import { TemplateType } from './type';
import { Point2D } from '../globals';
import { TEMPLATE_I } from './i';
import { TEMPLATE_L } from './l';
import { TEMPLATE_O } from './o';
import { TEMPLATE_S } from './s';
import { TEMPLATE_T } from './t';
import { TEMPLATE_Z } from './z';

export function getTemplate(type: TemplateType): Point2D[] {
	switch (type) {
		case TemplateType.I:
			return TEMPLATE_I.map(Point2D.clone);
		case TemplateType.L:
			return TEMPLATE_L.map(Point2D.clone);
		case TemplateType.O:
			return TEMPLATE_O.map(Point2D.clone);
		case TemplateType.S:
			return TEMPLATE_S.map(Point2D.clone);
		case TemplateType.T:
			return TEMPLATE_T.map(Point2D.clone);
		case TemplateType.Z:
			return TEMPLATE_Z.map(Point2D.clone);
		default:
			console.warn('template type "${type}" not found');
			return TEMPLATE_O.map(Point2D.clone);
	}
}
