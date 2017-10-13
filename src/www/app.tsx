import { Switch } from "./dom/Switch";
import * as React from "react";
import { connect } from "react-redux";

import { NavBarView } from "./blog/NavBar";
import { Route } from "react-router";

const App = () => (
	<div>
		<NavBarView></NavBarView>
		<Switch>
			<Route exact path="/">
				<div>
					<h1>Home</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor libero turpis, sed placerat nisl blandit eu. Donec sed dapibus arcu. Aliquam tristique dui nec congue pellentesque. Pellentesque vitae euismod dui. Ut dignissim porta massa, sed aliquam tortor molestie id. Praesent eleifend, est vitae rhoncus mollis, justo nibh mattis nisi, vel tempus mi leo at libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In laoreet magna ac eleifend sollicitudin. Etiam aliquam euismod interdum. Aliquam eget sapien at nulla convallis vehicula ut eu est. Vivamus suscipit, elit eget blandit suscipit, sapien eros aliquam ligula, ut laoreet nibh eros vel dolor.</p>
					<p>Sed eget justo at quam sagittis fermentum in sit amet neque. Etiam auctor libero a dolor mollis fringilla id quis elit. In pulvinar orci eget arcu convallis, a tristique quam malesuada. Aliquam id posuere neque, vitae convallis neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus egestas tempor lacus. Nam at pretium nunc.</p>
					<p>Donec blandit vulputate ex, eu sodales nunc lacinia id. In quis elit magna. Vivamus auctor hendrerit ipsum, eget ultrices orci tincidunt et. Phasellus dignissim metus purus, at consequat est maximus quis. Vestibulum bibendum ac neque ut vehicula. Aenean in justo at elit placerat interdum quis non ligula. In hac habitasse platea dictumst. Ut sodales, massa eu tincidunt bibendum, metus magna posuere lorem, vel semper odio turpis vitae sapien. Nunc sit amet tincidunt quam. Nunc finibus velit ornare suscipit euismod. Aliquam vel eleifend massa, sollicitudin bibendum magna. Integer pellentesque sit amet massa a consectetur.</p>
					<p>Nulla malesuada, arcu in convallis aliquam, diam ex placerat erat, sit amet imperdiet dolor ante ac leo. Cras augue orci, fringilla ullamcorper vehicula at, efficitur ac justo. Phasellus facilisis libero in tortor rutrum ornare. Fusce mi ipsum, hendrerit vitae nibh in, luctus semper nibh. Maecenas in ex quis augue gravida imperdiet sit amet eget enim. Curabitur ultricies bibendum varius. Aenean suscipit ac justo sed fermentum. Maecenas molestie urna purus, et suscipit velit finibus sollicitudin. Donec eget hendrerit est, vitae placerat mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat lectus vel nunc varius, id rutrum felis faucibus. Aenean rhoncus, nisi a rhoncus pulvinar, mi turpis gravida elit, sed blandit justo velit vel neque.</p>
					<p>Vivamus nec metus consectetur, tempor ex eu, sagittis mi. Vivamus sit amet arcu pellentesque, faucibus eros at, suscipit diam. In vel scelerisque urna, at pellentesque tortor. Vestibulum faucibus est et est venenatis vehicula. Proin semper lacus eget arcu posuere tempor. Praesent ornare, quam eu sollicitudin ultrices, tellus nisi gravida metus, ut vulputate augue nisl in enim. Duis condimentum, lorem et ultrices ultricies, elit quam tristique lacus, id consequat velit orci et purus. Nulla ut ultrices ante, sit amet imperdiet massa. Nulla blandit varius augue. Sed at luctus mauris.</p>
				</div>
			</Route>
			<Route exact path="/about">
				<div>
					<h1>About me</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor libero turpis, sed placerat nisl blandit eu. Donec sed dapibus arcu. Aliquam tristique dui nec congue pellentesque. Pellentesque vitae euismod dui. Ut dignissim porta massa, sed aliquam tortor molestie id. Praesent eleifend, est vitae rhoncus mollis, justo nibh mattis nisi, vel tempus mi leo at libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In laoreet magna ac eleifend sollicitudin. Etiam aliquam euismod interdum. Aliquam eget sapien at nulla convallis vehicula ut eu est. Vivamus suscipit, elit eget blandit suscipit, sapien eros aliquam ligula, ut laoreet nibh eros vel dolor.</p>
					<p>Sed eget justo at quam sagittis fermentum in sit amet neque. Etiam auctor libero a dolor mollis fringilla id quis elit. In pulvinar orci eget arcu convallis, a tristique quam malesuada. Aliquam id posuere neque, vitae convallis neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus egestas tempor lacus. Nam at pretium nunc.</p>
					<p>Donec blandit vulputate ex, eu sodales nunc lacinia id. In quis elit magna. Vivamus auctor hendrerit ipsum, eget ultrices orci tincidunt et. Phasellus dignissim metus purus, at consequat est maximus quis. Vestibulum bibendum ac neque ut vehicula. Aenean in justo at elit placerat interdum quis non ligula. In hac habitasse platea dictumst. Ut sodales, massa eu tincidunt bibendum, metus magna posuere lorem, vel semper odio turpis vitae sapien. Nunc sit amet tincidunt quam. Nunc finibus velit ornare suscipit euismod. Aliquam vel eleifend massa, sollicitudin bibendum magna. Integer pellentesque sit amet massa a consectetur.</p>
					<p>Nulla malesuada, arcu in convallis aliquam, diam ex placerat erat, sit amet imperdiet dolor ante ac leo. Cras augue orci, fringilla ullamcorper vehicula at, efficitur ac justo. Phasellus facilisis libero in tortor rutrum ornare. Fusce mi ipsum, hendrerit vitae nibh in, luctus semper nibh. Maecenas in ex quis augue gravida imperdiet sit amet eget enim. Curabitur ultricies bibendum varius. Aenean suscipit ac justo sed fermentum. Maecenas molestie urna purus, et suscipit velit finibus sollicitudin. Donec eget hendrerit est, vitae placerat mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat lectus vel nunc varius, id rutrum felis faucibus. Aenean rhoncus, nisi a rhoncus pulvinar, mi turpis gravida elit, sed blandit justo velit vel neque.</p>
					<p>Vivamus nec metus consectetur, tempor ex eu, sagittis mi. Vivamus sit amet arcu pellentesque, faucibus eros at, suscipit diam. In vel scelerisque urna, at pellentesque tortor. Vestibulum faucibus est et est venenatis vehicula. Proin semper lacus eget arcu posuere tempor. Praesent ornare, quam eu sollicitudin ultrices, tellus nisi gravida metus, ut vulputate augue nisl in enim. Duis condimentum, lorem et ultrices ultricies, elit quam tristique lacus, id consequat velit orci et purus. Nulla ut ultrices ante, sit amet imperdiet massa. Nulla blandit varius augue. Sed at luctus mauris.</p>
				</div>
			</Route>
		</Switch>
	</div>
);

export const AppView = connect()(App);
