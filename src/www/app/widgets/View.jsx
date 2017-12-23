import React from 'react';
import * as Widgets from './Widgets';

const toView = (ref) => {
    const [widget, mode] = ref.split('/');
    return Widgets[widget][mode];
};

export default function(props) {
    const views = props.refs.map((ref) => {
	const View = toView(ref);
	return <View key={ref} {...props} />;
    });

    if (!views.length) {
	const ref = 'Placeholder/View';
	const Placeholder = toView(ref);
	views.push(<Placeholder key={ref} />);
    }

    return (
	<div>{views}</div>
    );
}
