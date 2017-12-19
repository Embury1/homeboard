import React from 'react';
import * as widgets from './widgets';

const toView = (ref) => {
    const [widget, mode] = ref.split('/');
    return widgets[widget][mode];
};

export default function(props) {
    const views = props.refs.map((ref) => {
	const View = toView(ref);
	return <View key={ref} {...props} />;
    });

    if (!views.length) {
	const ref = 'placeholder/view';
	const Placeholder = toView(ref);
	views.push(<Placeholder key={ref} />);
    }

    return (
	<div>{views}</div>
    );
}
