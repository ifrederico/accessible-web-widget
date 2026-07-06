<?php
/**
 * Plugin Name:       Handrail Accessibility Widget
 * Plugin URI:        https://github.com/ifrederico/accessible-web-widget
 * Description:       Adds the Handrail accessibility widget to your site — font sizing, contrast modes, dyslexia-friendly font, text-to-speech, and more.
 * Version:           1.3.5
 * Requires at least: 5.0
 * Requires PHP:      7.2
 * Author:            ifrederico
 * Author URI:        https://github.com/ifrederico
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       handrail-widget
 *
 * @package HandrailWidget
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'ACCWEB_VERSION', '1.3.5' );
define( 'ACCWEB_OPTION_NAME', 'accweb_settings' );

/**
 * Default settings.
 *
 * @return array
 */
function accweb_get_defaults() {
	return array(
		'position' => 'bottom-right',
		'size'     => 44,
		'language' => 'auto',
	);
}

/**
 * Get saved settings merged with defaults.
 *
 * @return array
 */
function accweb_get_settings() {
	$settings = get_option( ACCWEB_OPTION_NAME, array() );
	return wp_parse_args( is_array( $settings ) ? $settings : array(), accweb_get_defaults() );
}

/**
 * Allowed widget positions.
 *
 * @return array
 */
function accweb_get_positions() {
	return array(
		'bottom-right' => __( 'Bottom right', 'handrail-widget' ),
		'bottom-left'  => __( 'Bottom left', 'handrail-widget' ),
		'top-right'    => __( 'Top right', 'handrail-widget' ),
		'top-left'     => __( 'Top left', 'handrail-widget' ),
	);
}

/**
 * Enqueue the widget script and inline options on the front end.
 */
function accweb_enqueue_script() {
	wp_enqueue_script(
		'handrail-widget',
		plugins_url( 'js/accessible-web-widget.wp.min.js', __FILE__ ),
		array(),
		ACCWEB_VERSION,
		true // Load in footer.
	);

	$settings = accweb_get_settings();

	$options = array(
		'position'        => $settings['position'],
		'size'            => absint( $settings['size'] ),
		'dyslexiaFontUrl' => plugins_url( 'fonts/OpenDyslexic3-Regular.woff', __FILE__ ),
		'axeCoreUrl'      => plugins_url( 'js/axe.min.js', __FILE__ ),
		// wordpress.org guideline 10: no front-end credit links without opt-in.
		'hideAttribution' => true,
	);

	if ( 'auto' !== $settings['language'] ) {
		$options['lang'] = $settings['language'];
	}

	wp_add_inline_script(
		'handrail-widget',
		'window.AccessibleWebWidgetOptions = ' . wp_json_encode( $options ) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'accweb_enqueue_script' );

/**
 * Register settings, sections, and fields.
 */
function accweb_register_settings() {
	register_setting(
		'accweb_settings_group',
		ACCWEB_OPTION_NAME,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'accweb_sanitize_settings',
			'default'           => accweb_get_defaults(),
		)
	);

	add_settings_section(
		'accweb_main_section',
		__( 'Widget Settings', 'handrail-widget' ),
		'__return_false',
		'handrail-widget'
	);

	add_settings_field(
		'accweb_position',
		__( 'Position', 'handrail-widget' ),
		'accweb_render_position_field',
		'handrail-widget',
		'accweb_main_section',
		array( 'label_for' => 'accweb_position' )
	);

	add_settings_field(
		'accweb_size',
		__( 'Button size (px)', 'handrail-widget' ),
		'accweb_render_size_field',
		'handrail-widget',
		'accweb_main_section',
		array( 'label_for' => 'accweb_size' )
	);

	add_settings_field(
		'accweb_language',
		__( 'Language', 'handrail-widget' ),
		'accweb_render_language_field',
		'handrail-widget',
		'accweb_main_section',
		array( 'label_for' => 'accweb_language' )
	);
}
add_action( 'admin_init', 'accweb_register_settings' );

/**
 * Sanitize settings before saving.
 *
 * @param mixed $input Raw input.
 * @return array
 */
function accweb_sanitize_settings( $input ) {
	$defaults = accweb_get_defaults();
	$input    = is_array( $input ) ? $input : array();
	$output   = array();

	$position           = isset( $input['position'] ) ? sanitize_key( $input['position'] ) : '';
	$output['position'] = array_key_exists( $position, accweb_get_positions() ) ? $position : $defaults['position'];

	$size           = isset( $input['size'] ) ? absint( $input['size'] ) : 0;
	$output['size'] = ( $size >= 24 && $size <= 128 ) ? $size : $defaults['size'];

	$language           = isset( $input['language'] ) ? sanitize_text_field( $input['language'] ) : '';
	$output['language'] = preg_match( '/^(auto|[a-z]{2}(-[A-Za-z]{2})?)$/', $language ) ? $language : $defaults['language'];

	return $output;
}

/**
 * Render the position field.
 */
function accweb_render_position_field() {
	$settings = accweb_get_settings();
	?>
	<select id="accweb_position" name="<?php echo esc_attr( ACCWEB_OPTION_NAME ); ?>[position]">
		<?php foreach ( accweb_get_positions() as $value => $label ) : ?>
			<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $settings['position'], $value ); ?>>
				<?php echo esc_html( $label ); ?>
			</option>
		<?php endforeach; ?>
	</select>
	<?php
}

/**
 * Render the size field.
 */
function accweb_render_size_field() {
	$settings = accweb_get_settings();
	?>
	<input type="number" id="accweb_size" name="<?php echo esc_attr( ACCWEB_OPTION_NAME ); ?>[size]"
		value="<?php echo esc_attr( $settings['size'] ); ?>" min="24" max="128" step="1" class="small-text" />
	<p class="description"><?php esc_html_e( 'Size of the widget button in pixels (24–128). Default: 44.', 'handrail-widget' ); ?></p>
	<?php
}

/**
 * Render the language field.
 */
function accweb_render_language_field() {
	$settings = accweb_get_settings();
	?>
	<input type="text" id="accweb_language" name="<?php echo esc_attr( ACCWEB_OPTION_NAME ); ?>[language]"
		value="<?php echo esc_attr( $settings['language'] ); ?>" class="regular-text" />
	<p class="description"><?php esc_html_e( 'Language code such as "en", "es", or "pt-BR". Use "auto" to detect from the browser. Default: auto.', 'handrail-widget' ); ?></p>
	<?php
}

/**
 * Add the settings page under Settings.
 */
function accweb_add_settings_page() {
	add_options_page(
		__( 'Handrail Accessibility Widget', 'handrail-widget' ),
		__( 'Handrail Accessibility Widget', 'handrail-widget' ),
		'manage_options',
		'handrail-widget',
		'accweb_render_settings_page'
	);
}
add_action( 'admin_menu', 'accweb_add_settings_page' );

/**
 * Render the settings page.
 */
function accweb_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'accweb_settings_group' );
			do_settings_sections( 'handrail-widget' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * Add a Settings link on the Plugins screen.
 *
 * @param array $links Existing action links.
 * @return array
 */
function accweb_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=handrail-widget' ) ),
		esc_html__( 'Settings', 'handrail-widget' )
	);
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'accweb_plugin_action_links' );
