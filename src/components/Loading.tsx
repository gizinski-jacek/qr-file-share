import style from '../styles/Loading.module.scss';

const Loading: React.FC<{ margin?: string; width?: string }> = ({
	margin,
	width,
}) => {
	return (
		<div
			className={style.loading_bar_container}
			style={{ margin: margin || 'auto', width: width || 'auto' }}
		>
			<div className={style.loading_bar}></div>
		</div>
	);
};

export default Loading;
